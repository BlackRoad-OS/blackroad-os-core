#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Proprietary Software
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================

"""
BlackRoad Stripe Monetization Service (Enhanced)

Advanced payment processing with usage-based billing, analytics, and lifecycle management.
Port: 9500

New Endpoints:
- POST /api/stripe/usage/record - Record usage event
- GET /api/stripe/usage/summary - Get usage summary
- POST /api/stripe/invoice/create - Create invoice
- GET /api/stripe/analytics - Payment analytics
- POST /api/stripe/subscription/upgrade - Upgrade subscription
- POST /api/stripe/subscription/cancel - Cancel subscription
- GET /api/stripe/customers/<id>/lifetime-value - Customer LTV
- POST /api/stripe/tax/calculate - Calculate tax
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import stripe
import hmac
import hashlib
from datetime import datetime, timedelta
from collections import defaultdict

app = Flask(__name__)
CORS(app)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

# Product pricing tiers
PRICING_TIERS = {
    "free": {
        "name": "Free",
        "price": 0,
        "requests_per_month": 1000,
        "features": ["Basic API access", "Community support"]
    },
    "starter": {
        "name": "Starter",
        "price": 29,
        "price_id": "price_starter_monthly",
        "requests_per_month": 10000,
        "features": ["API access", "Email support", "Analytics"]
    },
    "pro": {
        "name": "Pro",
        "price": 99,
        "price_id": "price_pro_monthly",
        "requests_per_month": 100000,
        "features": ["Priority API", "24/7 support", "Advanced analytics", "Custom integrations"]
    },
    "enterprise": {
        "name": "Enterprise",
        "price": 499,
        "price_id": "price_enterprise_monthly",
        "requests_per_month": -1,  # Unlimited
        "features": ["Unlimited API", "Dedicated support", "SLA", "Custom deployment"]
    }
}

# Usage tracking (in-memory for demo, use Redis/DB in production)
usage_data = defaultdict(lambda: {"count": 0, "period_start": datetime.utcnow()})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "service": "blackroad-stripe-monetization", "port": 9500})

@app.route("/api/stripe/products", methods=["GET"])
def list_products():
    """List all products and pricing"""
    try:
        # Get Stripe products
        products = stripe.Product.list(active=True)
        prices = stripe.Price.list(active=True)

        return jsonify({
            "ok": True,
            "products": products.data,
            "prices": prices.data,
            "tiers": PRICING_TIERS
        })
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/stripe/create-checkout", methods=["POST"])
def create_checkout():
    """Create Stripe checkout session"""
    try:
        data = request.get_json()
        price_id = data.get("price_id")
        customer_email = data.get("customer_email")

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url=data.get("success_url", "https://blackroad.io/success"),
            cancel_url=data.get("cancel_url", "https://blackroad.io/cancel"),
            customer_email=customer_email,
            metadata={
                "user_id": data.get("user_id"),
                "tier": data.get("tier", "starter")
            }
        )

        return jsonify({
            "ok": True,
            "session_id": session.id,
            "url": session.url
        })
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/stripe/usage/record", methods=["POST"])
def record_usage():
    """Record usage event for metered billing"""
    try:
        data = request.get_json()
        customer_id = data.get("customer_id")
        quantity = data.get("quantity", 1)
        timestamp = data.get("timestamp", int(datetime.utcnow().timestamp()))

        # Get subscription with metered price
        subscriptions = stripe.Subscription.list(customer=customer_id, status="active")

        if not subscriptions.data:
            return jsonify({"ok": False, "error": "No active subscription"}), 404

        subscription = subscriptions.data[0]

        # Find metered subscription item
        metered_item = None
        for item in subscription["items"]["data"]:
            if item.price.recurring.usage_type == "metered":
                metered_item = item
                break

        if metered_item:
            # Record usage
            usage_record = stripe.SubscriptionItem.create_usage_record(
                metered_item.id,
                quantity=quantity,
                timestamp=timestamp,
                action="increment"
            )

            # Track locally
            usage_data[customer_id]["count"] += quantity

            return jsonify({
                "ok": True,
                "usage_record": usage_record,
                "total_usage": usage_data[customer_id]["count"]
            })
        else:
            return jsonify({"ok": False, "error": "No metered items in subscription"}), 400

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/stripe/usage/summary", methods=["GET"])
def usage_summary():
    """Get usage summary for customer"""
    try:
        customer_id = request.args.get("customer_id")

        # Get subscription
        subscriptions = stripe.Subscription.list(customer=customer_id, status="active")

        if not subscriptions.data:
            return jsonify({"ok": False, "error": "No active subscription"}), 404

        subscription = subscriptions.data[0]

        # Get usage records
        usage_records = []
        for item in subscription["items"]["data"]:
            if item.price.recurring.usage_type == "metered":
                records = stripe.SubscriptionItem.list_usage_record_summaries(item.id)
                usage_records.extend(records.data)

        return jsonify({
            "ok": True,
            "customer_id": customer_id,
            "subscription_id": subscription.id,
            "usage_records": usage_records,
            "local_count": usage_data[customer_id]["count"]
        })
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/stripe/subscription/upgrade", methods=["POST"])
def upgrade_subscription():
    """Upgrade customer subscription"""
    try:
        data = request.get_json()
        subscription_id = data.get("subscription_id")
        new_price_id = data.get("new_price_id")

        # Get subscription
        subscription = stripe.Subscription.retrieve(subscription_id)

        # Update subscription
        updated_subscription = stripe.Subscription.modify(
            subscription_id,
            items=[{
                "id": subscription["items"]["data"][0].id,
                "price": new_price_id
            }],
            proration_behavior="always_invoice"
        )

        return jsonify({
            "ok": True,
            "subscription": updated_subscription,
            "message": "Subscription upgraded successfully"
        })
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/stripe/subscription/cancel", methods=["POST"])
def cancel_subscription():
    """Cancel subscription (with option for immediate or end of period)"""
    try:
        data = request.get_json()
        subscription_id = data.get("subscription_id")
        immediate = data.get("immediate", False)

        if immediate:
            subscription = stripe.Subscription.delete(subscription_id)
        else:
            subscription = stripe.Subscription.modify(
                subscription_id,
                cancel_at_period_end=True
            )

        return jsonify({
            "ok": True,
            "subscription": subscription,
            "cancelled_at": subscription.canceled_at if immediate else subscription.cancel_at
        })
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/stripe/invoice/create", methods=["POST"])
def create_invoice():
    """Create invoice for customer"""
    try:
        data = request.get_json()
        customer_id = data.get("customer_id")
        amount = data.get("amount")
        description = data.get("description", "BlackRoad OS Service")

        # Create invoice item
        invoice_item = stripe.InvoiceItem.create(
            customer=customer_id,
            amount=amount,
            currency="usd",
            description=description
        )

        # Create invoice
        invoice = stripe.Invoice.create(
            customer=customer_id,
            auto_advance=True
        )

        # Finalize invoice
        invoice = stripe.Invoice.finalize_invoice(invoice.id)

        return jsonify({
            "ok": True,
            "invoice": invoice,
            "invoice_url": invoice.hosted_invoice_url
        })
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/stripe/tax/calculate", methods=["POST"])
def calculate_tax():
    """Calculate tax for transaction (uses Stripe Tax)"""
    try:
        data = request.get_json()
        amount = data.get("amount")
        country = data.get("country", "US")
        state = data.get("state")

        # Calculate tax using Stripe Tax
        tax_calculation = stripe.tax.Calculation.create(
            currency="usd",
            line_items=[{
                "amount": amount,
                "reference": "blackroad-service"
            }],
            customer_details={
                "address": {
                    "country": country,
                    "state": state
                },
                "address_source": "shipping"
            }
        )

        return jsonify({
            "ok": True,
            "tax_amount": tax_calculation.tax_amount_exclusive,
            "total_amount": tax_calculation.amount_total,
            "tax_breakdown": tax_calculation.tax_breakdown
        })
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/stripe/analytics", methods=["GET"])
def analytics():
    """Payment analytics and reporting"""
    try:
        days = int(request.args.get("days", 30))

        # Get charges from last N days
        charges = stripe.Charge.list(
            created={
                "gte": int((datetime.utcnow() - timedelta(days=days)).timestamp())
            },
            limit=100
        )

        # Calculate metrics
        total_revenue = sum(c.amount for c in charges.data if c.paid) / 100
        total_transactions = len(charges.data)
        successful_transactions = len([c for c in charges.data if c.paid])
        failed_transactions = len([c for c in charges.data if not c.paid])

        # Get customers
        customers = stripe.Customer.list(limit=100)
        active_customers = len([c for c in customers.data if c.subscriptions.data])

        return jsonify({
            "ok": True,
            "period_days": days,
            "metrics": {
                "total_revenue": total_revenue,
                "total_transactions": total_transactions,
                "successful_transactions": successful_transactions,
                "failed_transactions": failed_transactions,
                "success_rate": (successful_transactions / total_transactions * 100) if total_transactions > 0 else 0,
                "active_customers": active_customers,
                "average_transaction": total_revenue / successful_transactions if successful_transactions > 0 else 0
            },
            "recent_charges": charges.data[:10]
        })
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/stripe/customers/<customer_id>/lifetime-value", methods=["GET"])
def customer_lifetime_value(customer_id):
    """Calculate customer lifetime value"""
    try:
        # Get all charges for customer
        charges = stripe.Charge.list(customer=customer_id, limit=100)

        total_spent = sum(c.amount for c in charges.data if c.paid) / 100
        total_transactions = len([c for c in charges.data if c.paid])

        # Get customer details
        customer = stripe.Customer.retrieve(customer_id)
        created_at = datetime.fromtimestamp(customer.created)
        days_active = (datetime.utcnow() - created_at).days or 1

        # Get active subscriptions
        subscriptions = stripe.Subscription.list(customer=customer_id, status="active")
        monthly_recurring = sum(
            s.items.data[0].price.unit_amount / 100
            for s in subscriptions.data
        ) if subscriptions.data else 0

        # Calculate LTV (simple model)
        avg_lifetime_months = 12  # Assume 12 month average lifetime
        predicted_ltv = monthly_recurring * avg_lifetime_months

        return jsonify({
            "ok": True,
            "customer_id": customer_id,
            "total_spent": total_spent,
            "total_transactions": total_transactions,
            "days_active": days_active,
            "monthly_recurring_revenue": monthly_recurring,
            "predicted_lifetime_value": predicted_ltv,
            "average_transaction": total_spent / total_transactions if total_transactions > 0 else 0
        })
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/stripe/webhook", methods=["POST"])
def webhook():
    """Handle Stripe webhooks"""
    try:
        payload = request.get_data()
        sig_header = request.headers.get("Stripe-Signature")

        # Verify webhook signature
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )

        # Handle event
        if event.type == "checkout.session.completed":
            session = event.data.object
            handle_successful_payment(session)
        elif event.type == "customer.subscription.updated":
            subscription = event.data.object
            handle_subscription_updated(subscription)
        elif event.type == "customer.subscription.deleted":
            subscription = event.data.object
            handle_subscription_cancelled(subscription)
        elif event.type == "invoice.payment_failed":
            invoice = event.data.object
            handle_payment_failed(invoice)

        return jsonify({"ok": True, "event_type": event.type})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 400

def handle_successful_payment(session):
    """Handle successful payment"""
    print(f"Payment successful: {session.id}")
    # TODO: Activate subscription, grant access, send confirmation email

def handle_subscription_updated(subscription):
    """Handle subscription update"""
    print(f"Subscription updated: {subscription.id}")
    # TODO: Update user access, notify user

def handle_subscription_cancelled(subscription):
    """Handle subscription cancellation"""
    print(f"Subscription cancelled: {subscription.id}")
    # TODO: Revoke access, send cancellation email

def handle_payment_failed(invoice):
    """Handle failed payment"""
    print(f"Payment failed: {invoice.id}")
    # TODO: Notify user, retry payment, suspend access

if __name__ == "__main__":
    port = int(os.getenv("PORT", 9500))
    app.run(host="0.0.0.0", port=port, debug=False)
