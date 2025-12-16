#!/usr/bin/env python3
"""
Options Trading Calculator with Quadrant Framework
Implements the complete 2x2 quadrant system with logarithmic analysis.

Based on:
- 4 Primary Quadrants (Long/Short × Call/Put)
- Spread Quadrants (Debit/Credit variations)
- Stock+Option Combinations
- Logarithmic base mappings (log2, log3, ln, log10)
- Greek calculations
- Z-framework integration (Z = yx - w)
"""

import math
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum


class OptionType(Enum):
    CALL = "CALL"
    PUT = "PUT"


class PositionType(Enum):
    LONG = 1    # Buy - You PAY premium
    SHORT = -1  # Sell - You RECEIVE premium
    NEUTRAL = 0


@dataclass
class OptionPosition:
    """Represents a single option position"""
    option_type: OptionType
    position_type: PositionType
    strike: float  # X
    premium: float  # P
    quantity: int = 1

    def __str__(self):
        pos = "Long" if self.position_type == PositionType.LONG else "Short"
        return f"{pos} {self.option_type.value} @ ${self.strike} for ${self.premium}"


class OptionsCalculator:
    """Calculator for options positions with quadrant framework"""

    def __init__(self, current_price: float = 100.0):
        """
        Initialize calculator with current stock price

        Args:
            current_price: Current price of underlying (S)
        """
        self.S = current_price

    # ========== QUADRANT I: LONG CALL (Bullish ↑) ==========

    def long_call(self, X: float, P: float, S_T: float) -> Dict:
        """
        Quadrant I: Buy Call - Right to Buy
        Market View: Bullish (expecting S↑)

        Args:
            X: Strike price
            P: Premium paid
            S_T: Stock price at expiration

        Returns:
            Dict with breakeven, profit, max gain, max loss, log analysis
        """
        BE = X + P
        intrinsic = max(S_T - X, 0)
        profit = intrinsic - P

        return {
            'position': 'LONG CALL (Q-I)',
            'market_view': 'BULLISH ↑',
            'breakeven': BE,
            'profit': profit,
            'intrinsic_value': intrinsic,
            'max_gain': float('inf'),
            'max_loss': -P,
            'log_moneyness': math.log(S_T / X) if S_T > 0 and X > 0 else None,
            'log_moneyness_BE': math.log(BE / X) if BE > 0 and X > 0 else None,
            'information_bits': -math.log2(P / self.S) if P > 0 and self.S > 0 else None,
            'in_the_money': S_T > X,
            'profitable': profit > 0
        }

    # ========== QUADRANT II: LONG PUT (Bearish ↓) ==========

    def long_put(self, X: float, P: float, S_T: float) -> Dict:
        """
        Quadrant II: Buy Put - Right to Sell
        Market View: Bearish (expecting S↓)

        Args:
            X: Strike price
            P: Premium paid
            S_T: Stock price at expiration

        Returns:
            Dict with breakeven, profit, max gain, max loss, log analysis
        """
        BE = X - P
        intrinsic = max(X - S_T, 0)
        profit = intrinsic - P

        return {
            'position': 'LONG PUT (Q-II)',
            'market_view': 'BEARISH ↓',
            'breakeven': BE,
            'profit': profit,
            'intrinsic_value': intrinsic,
            'max_gain': X - P,  # Stock goes to zero
            'max_loss': -P,
            'log_moneyness': math.log(S_T / X) if S_T > 0 and X > 0 else None,
            'log_moneyness_BE': math.log(BE / X) if BE > 0 and X > 0 else None,
            'information_bits': -math.log2(P / self.S) if P > 0 and self.S > 0 else None,
            'in_the_money': S_T < X,
            'profitable': profit > 0
        }

    # ========== QUADRANT III: SHORT CALL (Bearish ↓) ==========

    def short_call(self, X: float, P: float, S_T: float) -> Dict:
        """
        Quadrant III: Write Call - Obligation to Sell
        Market View: Bearish/Neutral (expecting S↓ or S→)

        Args:
            X: Strike price
            P: Premium received
            S_T: Stock price at expiration

        Returns:
            Dict with breakeven, profit, max gain, max loss, log analysis
        """
        BE = X + P
        intrinsic = max(S_T - X, 0)
        profit = P - intrinsic

        return {
            'position': 'SHORT CALL (Q-III)',
            'market_view': 'BEARISH/NEUTRAL ↓-N',
            'breakeven': BE,
            'profit': profit,
            'intrinsic_value': intrinsic,
            'max_gain': P,
            'max_loss': float('-inf'),
            'log_moneyness': math.log(S_T / X) if S_T > 0 and X > 0 else None,
            'log_moneyness_BE': math.log(BE / X) if BE > 0 and X > 0 else None,
            'information_bits': -math.log2(P / self.S) if P > 0 and self.S > 0 else None,
            'in_the_money': S_T > X,
            'profitable': profit > 0,
            'win_condition': 'Expire worthless'
        }

    # ========== QUADRANT IV: SHORT PUT (Bullish ↑) ==========

    def short_put(self, X: float, P: float, S_T: float) -> Dict:
        """
        Quadrant IV: Write Put - Obligation to Buy
        Market View: Bullish/Neutral (expecting S↑ or S→)

        Args:
            X: Strike price
            P: Premium received
            S_T: Stock price at expiration

        Returns:
            Dict with breakeven, profit, max gain, max loss, log analysis
        """
        BE = X - P
        intrinsic = max(X - S_T, 0)
        profit = P - intrinsic

        return {
            'position': 'SHORT PUT (Q-IV)',
            'market_view': 'BULLISH/NEUTRAL ↑-N',
            'breakeven': BE,
            'profit': profit,
            'intrinsic_value': intrinsic,
            'max_gain': P,
            'max_loss': -(X - P),  # Stock goes to zero
            'log_moneyness': math.log(S_T / X) if S_T > 0 and X > 0 else None,
            'log_moneyness_BE': math.log(BE / X) if BE > 0 and X > 0 else None,
            'information_bits': -math.log2(P / self.S) if P > 0 and self.S > 0 else None,
            'in_the_money': S_T < X,
            'profitable': profit > 0,
            'win_condition': 'Expire worthless'
        }

    # ========== SPREAD STRATEGIES ==========

    def debit_call_spread(self, X1: float, X2: float, P1: float, P2: float, S_T: float) -> Dict:
        """
        Bull Call Spread (Debit)
        Buy Call at X1 (lower), Sell Call at X2 (higher)

        Args:
            X1: Lower strike (buy)
            X2: Higher strike (sell)
            P1: Premium paid for X1
            P2: Premium received for X2
            S_T: Stock price at expiration
        """
        net_debit = P1 - P2
        BE = X1 + net_debit

        profit_long = max(S_T - X1, 0) - P1
        profit_short = P2 - max(S_T - X2, 0)
        profit = profit_long + profit_short

        spread_width = X2 - X1
        max_gain = spread_width - net_debit
        max_loss = -net_debit

        return {
            'position': 'DEBIT CALL SPREAD (Bull)',
            'market_view': 'BULLISH ↑',
            'strikes': (X1, X2),
            'net_debit': net_debit,
            'breakeven': BE,
            'profit': profit,
            'max_gain': max_gain,
            'max_loss': max_loss,
            'spread_width': spread_width,
            'win_condition': 'Exercised (both legs)',
            'profitable': profit > 0,
            'risk_reward_ratio': max_gain / abs(max_loss) if max_loss != 0 else float('inf')
        }

    def credit_call_spread(self, X1: float, X2: float, P1: float, P2: float, S_T: float) -> Dict:
        """
        Bear Call Spread (Credit)
        Sell Call at X1 (lower), Buy Call at X2 (higher)

        Args:
            X1: Lower strike (sell)
            X2: Higher strike (buy)
            P1: Premium received for X1
            P2: Premium paid for X2
            S_T: Stock price at expiration
        """
        net_credit = P1 - P2
        BE = X1 + net_credit

        profit_short = P1 - max(S_T - X1, 0)
        profit_long = max(S_T - X2, 0) - P2
        profit = profit_short + profit_long

        spread_width = X2 - X1
        max_gain = net_credit
        max_loss = -(spread_width - net_credit)

        return {
            'position': 'CREDIT CALL SPREAD (Bear)',
            'market_view': 'BEARISH ↓',
            'strikes': (X1, X2),
            'net_credit': net_credit,
            'breakeven': BE,
            'profit': profit,
            'max_gain': max_gain,
            'max_loss': max_loss,
            'spread_width': spread_width,
            'win_condition': 'Expire worthless (both legs)',
            'profitable': profit > 0,
            'risk_reward_ratio': max_gain / abs(max_loss) if max_loss != 0 else float('inf')
        }

    def debit_put_spread(self, X1: float, X2: float, P1: float, P2: float, S_T: float) -> Dict:
        """
        Bear Put Spread (Debit)
        Buy Put at X2 (higher), Sell Put at X1 (lower)

        Args:
            X1: Lower strike (sell)
            X2: Higher strike (buy)
            P1: Premium received for X1
            P2: Premium paid for X2
            S_T: Stock price at expiration
        """
        net_debit = P2 - P1
        BE = X2 - net_debit

        profit_long = max(X2 - S_T, 0) - P2
        profit_short = P1 - max(X1 - S_T, 0)
        profit = profit_long + profit_short

        spread_width = X2 - X1
        max_gain = spread_width - net_debit
        max_loss = -net_debit

        return {
            'position': 'DEBIT PUT SPREAD (Bear)',
            'market_view': 'BEARISH ↓',
            'strikes': (X1, X2),
            'net_debit': net_debit,
            'breakeven': BE,
            'profit': profit,
            'max_gain': max_gain,
            'max_loss': max_loss,
            'spread_width': spread_width,
            'win_condition': 'Exercised (both legs)',
            'profitable': profit > 0,
            'risk_reward_ratio': max_gain / abs(max_loss) if max_loss != 0 else float('inf')
        }

    def credit_put_spread(self, X1: float, X2: float, P1: float, P2: float, S_T: float) -> Dict:
        """
        Bull Put Spread (Credit)
        Sell Put at X2 (higher), Buy Put at X1 (lower)

        Args:
            X1: Lower strike (buy)
            X2: Higher strike (sell)
            P1: Premium paid for X1
            P2: Premium received for X2
            S_T: Stock price at expiration
        """
        net_credit = P2 - P1
        BE = X2 - net_credit

        profit_short = P2 - max(X2 - S_T, 0)
        profit_long = max(X1 - S_T, 0) - P1
        profit = profit_short + profit_long

        spread_width = X2 - X1
        max_gain = net_credit
        max_loss = -(spread_width - net_credit)

        return {
            'position': 'CREDIT PUT SPREAD (Bull)',
            'market_view': 'BULLISH ↑',
            'strikes': (X1, X2),
            'net_credit': net_credit,
            'breakeven': BE,
            'profit': profit,
            'max_gain': max_gain,
            'max_loss': max_loss,
            'spread_width': spread_width,
            'win_condition': 'Expire worthless (both legs)',
            'profitable': profit > 0,
            'risk_reward_ratio': max_gain / abs(max_loss) if max_loss != 0 else float('inf')
        }

    # ========== STOCK + OPTION COMBINATIONS ==========

    def protective_put(self, M: float, X: float, P: float, S_T: float) -> Dict:
        """
        LS/LP - Long Stock + Long Put (Married Put)
        Market View: Bullish with downside protection

        Args:
            M: Stock purchase price
            X: Put strike price
            P: Put premium paid
            S_T: Stock price at expiration
        """
        BE = M + P
        stock_pnl = S_T - M
        put_pnl = max(X - S_T, 0) - P
        profit = stock_pnl + put_pnl

        # Maximum loss occurs when stock falls below strike
        max_loss = M - X + P

        return {
            'position': 'PROTECTIVE PUT (LS/LP)',
            'market_view': 'BULLISH ↑ (with protection)',
            'stock_price': M,
            'strike': X,
            'premium': P,
            'breakeven': BE,
            'profit': profit,
            'stock_pnl': stock_pnl,
            'put_pnl': put_pnl,
            'max_gain': float('inf'),
            'max_loss': -max_loss,
            'protected_below': X,
            'profitable': profit > 0
        }

    def covered_call(self, M: float, X: float, P: float, S_T: float) -> Dict:
        """
        LS/SC - Long Stock + Short Call
        Market View: Bullish/Neutral

        Args:
            M: Stock purchase price
            X: Call strike price
            P: Call premium received
            S_T: Stock price at expiration
        """
        BE = M - P
        stock_pnl = S_T - M
        call_pnl = P - max(S_T - X, 0)
        profit = stock_pnl + call_pnl

        max_gain = X - M + P
        max_loss = M - P  # Stock goes to zero

        return {
            'position': 'COVERED CALL (LS/SC)',
            'market_view': 'BULLISH/NEUTRAL ↑-N',
            'stock_price': M,
            'strike': X,
            'premium': P,
            'breakeven': BE,
            'profit': profit,
            'stock_pnl': stock_pnl,
            'call_pnl': call_pnl,
            'max_gain': max_gain,
            'max_loss': -max_loss,
            'capped_above': X,
            'profitable': profit > 0
        }

    # ========== LOGARITHMIC ANALYSIS ==========

    def log_analysis(self, X: float, P: float, S_T: float) -> Dict:
        """
        Multi-base logarithmic analysis of option position

        Args:
            X: Strike price
            P: Premium
            S_T: Stock price at expiration

        Returns:
            Dict with log₂, log₃, ln, log₁₀ analysis
        """
        moneyness = S_T / X if X > 0 else 0

        return {
            'moneyness': moneyness,
            'ln_moneyness': math.log(moneyness) if moneyness > 0 else None,
            'log10_moneyness': math.log10(moneyness) if moneyness > 0 else None,
            'log2_moneyness': math.log2(moneyness) if moneyness > 0 else None,
            'log3_position': math.log(3, 3),  # Trinary: Long/Neutral/Short
            'information_bits': -math.log2(P / S_T) if P > 0 and S_T > 0 else None,
            'premium_decay_rate': -math.log(P / X) if P > 0 and X > 0 else None,
        }

    # ========== Z-FRAMEWORK (Z = yx - w) ==========

    def z_framework(self, delta: float, S: float, P: float, gamma: float = 0,
                    theta: float = 0, vega: float = 0, delta_S: float = 0,
                    delta_sigma: float = 0) -> Dict:
        """
        Z-Framework: Z = Δ·S - P

        Args:
            delta: Delta (y in Z framework)
            S: Stock price (x in Z framework)
            P: Premium (w in Z framework)
            gamma: Gamma (optional)
            theta: Theta (optional)
            vega: Vega (optional)
            delta_S: Change in stock price
            delta_sigma: Change in volatility

        Returns:
            Dict with Z value and rate of change
        """
        Z = delta * S - P

        # Rate of change: ∂Z/∂t = Γ·(ΔS)²/2 + Θ + Vega·Δσ
        dZ_dt = (gamma * (delta_S ** 2) / 2) + theta + (vega * delta_sigma)

        return {
            'Z': Z,
            'delta': delta,
            'stock_price': S,
            'premium': P,
            'dZ_dt': dZ_dt,
            'gamma_contribution': gamma * (delta_S ** 2) / 2,
            'theta_contribution': theta,
            'vega_contribution': vega * delta_sigma
        }

    # ========== UTILITY FUNCTIONS ==========

    def print_table(self, headers: List[str], rows: List[List], title: str = ""):
        """Print a formatted table"""
        if title:
            print(f"\n{title}")
            print("=" * 80)

        # Calculate column widths
        col_widths = [len(str(h)) for h in headers]
        for row in rows:
            for i, cell in enumerate(row):
                col_widths[i] = max(col_widths[i], len(str(cell)))

        # Print header
        header_line = " | ".join(str(h).ljust(col_widths[i]) for i, h in enumerate(headers))
        print(header_line)
        print("-" * len(header_line))

        # Print rows
        for row in rows:
            print(" | ".join(str(cell).ljust(col_widths[i]) for i, cell in enumerate(row)))

        print()

    def print_result(self, result: Dict):
        """Pretty print result dictionary"""
        print("\n" + "=" * 80)
        print(f"POSITION: {result.get('position', 'Unknown')}")
        print(f"MARKET VIEW: {result.get('market_view', 'N/A')}")
        print("=" * 80)

        for key, value in result.items():
            if key in ['position', 'market_view']:
                continue

            # Format value
            if isinstance(value, float):
                if abs(value) == float('inf'):
                    formatted = '∞' if value > 0 else '-∞'
                elif abs(value) < 0.0001 and value != 0:
                    formatted = f"{value:.6e}"
                else:
                    formatted = f"{value:.4f}"
            else:
                formatted = str(value)

            print(f"{key.replace('_', ' ').title():.<30} {formatted}")

        print()


def main():
    """Demo the options calculator with quadrant framework"""

    calc = OptionsCalculator(current_price=100.0)

    print("\n" + "=" * 80)
    print("OPTIONS CALCULATOR - QUADRANT FRAMEWORK".center(80))
    print("=" * 80)

    # Example 1: Test all 4 primary quadrants
    print("\n### PRIMARY QUADRANTS (2×2 Framework) ###\n")

    # Quadrant I: Long Call (Bullish)
    result = calc.long_call(X=100, P=5, S_T=110)
    calc.print_result(result)

    # Quadrant II: Long Put (Bearish)
    result = calc.long_put(X=100, P=5, S_T=90)
    calc.print_result(result)

    # Quadrant III: Short Call (Bearish)
    result = calc.short_call(X=100, P=5, S_T=95)
    calc.print_result(result)

    # Quadrant IV: Short Put (Bullish)
    result = calc.short_put(X=100, P=5, S_T=105)
    calc.print_result(result)

    # Example 2: Test spread strategies
    print("\n### SPREAD QUADRANTS ###\n")

    # Debit Call Spread (Bull)
    result = calc.debit_call_spread(X1=100, X2=110, P1=5, P2=2, S_T=108)
    calc.print_result(result)

    # Credit Put Spread (Bull)
    result = calc.credit_put_spread(X1=90, X2=100, P1=2, P2=5, S_T=105)
    calc.print_result(result)

    # Example 3: Stock + Option combinations
    print("\n### STOCK + OPTION COMBINATIONS ###\n")

    # Protective Put
    result = calc.protective_put(M=100, X=95, P=3, S_T=105)
    calc.print_result(result)

    # Covered Call
    result = calc.covered_call(M=100, X=110, P=5, S_T=108)
    calc.print_result(result)

    # Example 4: Logarithmic analysis
    print("\n### LOGARITHMIC ANALYSIS (Multi-base) ###\n")

    log_result = calc.log_analysis(X=100, P=5, S_T=110)
    calc.print_result(log_result)

    # Example 5: Z-Framework
    print("\n### Z-FRAMEWORK (Z = yx - w) ###\n")

    z_result = calc.z_framework(
        delta=0.6,      # y
        S=100,          # x
        P=5,            # w
        gamma=0.02,
        theta=-0.05,
        vega=0.15,
        delta_S=2,
        delta_sigma=0.01
    )
    calc.print_result(z_result)

    print("=" * 80)
    print()


if __name__ == '__main__':
    main()
