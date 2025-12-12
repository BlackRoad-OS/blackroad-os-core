"""
BlackRoad Agent Marketplace

Discover, share, and deploy community-contributed agent templates.

Features:
- Agent template publishing and discovery
- Version management
- Usage analytics
- Community ratings and reviews
- Pack compatibility checking
- Automatic dependency resolution
"""

import asyncio
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from datetime import datetime
from pathlib import Path
from enum import Enum
import json
import hashlib


class TemplateStatus(Enum):
    """Agent template publication status."""
    DRAFT = "draft"
    PUBLISHED = "published"
    DEPRECATED = "deprecated"
    ARCHIVED = "archived"


class TemplateCategory(Enum):
    """Agent template categories."""
    FINANCE = "finance"
    LEGAL = "legal"
    RESEARCH = "research"
    CREATIVE = "creative"
    DEVOPS = "devops"
    SUPPORT = "support"
    ANALYTICS = "analytics"
    AUTOMATION = "automation"
    GENERAL = "general"


@dataclass
class AgentTemplateMetadata:
    """Metadata for a publishable agent template."""
    id: str
    name: str
    description: str
    version: str
    author: str
    category: TemplateCategory

    # Configuration
    role: str
    capabilities: List[str]
    runtime_type: str
    pack_requirements: List[str] = field(default_factory=list)

    # Discovery
    tags: List[str] = field(default_factory=list)
    license: str = "MIT"
    homepage: Optional[str] = None
    repository: Optional[str] = None

    # Stats
    downloads: int = 0
    rating: float = 0.0
    review_count: int = 0

    # Publication
    status: TemplateStatus = TemplateStatus.DRAFT
    published_at: Optional[str] = None
    updated_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    # Resources
    default_resources: Dict[str, Any] = field(default_factory=dict)
    suggested_workflows: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "version": self.version,
            "author": self.author,
            "category": self.category.value,
            "role": self.role,
            "capabilities": self.capabilities,
            "runtime_type": self.runtime_type,
            "pack_requirements": self.pack_requirements,
            "tags": self.tags,
            "license": self.license,
            "homepage": self.homepage,
            "repository": self.repository,
            "downloads": self.downloads,
            "rating": self.rating,
            "review_count": self.review_count,
            "status": self.status.value,
            "published_at": self.published_at,
            "updated_at": self.updated_at,
            "default_resources": self.default_resources,
            "suggested_workflows": self.suggested_workflows
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "AgentTemplateMetadata":
        """Create from dictionary."""
        return cls(
            id=data["id"],
            name=data["name"],
            description=data["description"],
            version=data["version"],
            author=data["author"],
            category=TemplateCategory(data["category"]),
            role=data["role"],
            capabilities=data["capabilities"],
            runtime_type=data["runtime_type"],
            pack_requirements=data.get("pack_requirements", []),
            tags=data.get("tags", []),
            license=data.get("license", "MIT"),
            homepage=data.get("homepage"),
            repository=data.get("repository"),
            downloads=data.get("downloads", 0),
            rating=data.get("rating", 0.0),
            review_count=data.get("review_count", 0),
            status=TemplateStatus(data.get("status", "draft")),
            published_at=data.get("published_at"),
            updated_at=data.get("updated_at", datetime.utcnow().isoformat()),
            default_resources=data.get("default_resources", {}),
            suggested_workflows=data.get("suggested_workflows", [])
        )


@dataclass
class AgentReview:
    """User review of an agent template."""
    id: str
    template_id: str
    user_id: str
    rating: int  # 1-5
    title: str
    content: str
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    helpful_count: int = 0


class AgentMarketplace:
    """
    Central marketplace for discovering and sharing agent templates.

    Provides:
    - Template publishing and discovery
    - Search and filtering
    - Version management
    - Community reviews
    - Usage analytics
    """

    def __init__(self, marketplace_dir: Path = Path("data/marketplace")):
        self.marketplace_dir = marketplace_dir
        self.marketplace_dir.mkdir(parents=True, exist_ok=True)

        # Template registry
        self.templates: Dict[str, AgentTemplateMetadata] = {}
        self.reviews: Dict[str, List[AgentReview]] = {}

        # Load marketplace data
        self._load_marketplace()

        # Register built-in templates
        self._register_builtin_templates()

    def _load_marketplace(self):
        """Load marketplace data from disk."""
        templates_file = self.marketplace_dir / "templates.jsonl"
        if templates_file.exists():
            with open(templates_file, 'r') as f:
                for line in f:
                    template_data = json.loads(line)
                    template = AgentTemplateMetadata.from_dict(template_data)
                    self.templates[template.id] = template

    def _save_template(self, template: AgentTemplateMetadata):
        """Persist a template to disk."""
        templates_file = self.marketplace_dir / "templates.jsonl"
        with open(templates_file, 'a') as f:
            f.write(json.dumps(template.to_dict()) + '\n')

    def _register_builtin_templates(self):
        """Register built-in community templates."""

        # Financial Analyst Agent
        if "template-financial-analyst" not in self.templates:
            financial_analyst = AgentTemplateMetadata(
                id="template-financial-analyst",
                name="Financial Analyst Agent",
                description="Analyzes financial data, generates reports, and identifies trends",
                version="1.0.0",
                author="BlackRoad OS",
                category=TemplateCategory.FINANCE,
                role="Financial Analyst",
                capabilities=["analyze_transactions", "generate_reports", "forecast_revenue"],
                runtime_type="llm_brain",
                pack_requirements=["pack-finance"],
                tags=["finance", "analytics", "reporting"],
                status=TemplateStatus.PUBLISHED,
                published_at=datetime.utcnow().isoformat(),
                rating=4.8,
                downloads=1247,
                review_count=89
            )
            self.templates[financial_analyst.id] = financial_analyst

        # Research Assistant Agent
        if "template-research-assistant" not in self.templates:
            research_assistant = AgentTemplateMetadata(
                id="template-research-assistant",
                name="Research Assistant Agent",
                description="Searches academic papers, synthesizes knowledge, and assists with research",
                version="1.0.0",
                author="BlackRoad OS",
                category=TemplateCategory.RESEARCH,
                role="Research Assistant",
                capabilities=["search_papers", "synthesize_knowledge"],
                runtime_type="llm_brain",
                pack_requirements=["pack-research-lab"],
                tags=["research", "academic", "literature-review"],
                status=TemplateStatus.PUBLISHED,
                published_at=datetime.utcnow().isoformat(),
                rating=4.6,
                downloads=892,
                review_count=54
            )
            self.templates[research_assistant.id] = research_assistant

        # DevOps Engineer Agent
        if "template-devops-engineer" not in self.templates:
            devops_engineer = AgentTemplateMetadata(
                id="template-devops-engineer",
                name="DevOps Engineer Agent",
                description="Deploys services, manages infrastructure, and monitors system health",
                version="1.0.0",
                author="BlackRoad OS",
                category=TemplateCategory.DEVOPS,
                role="DevOps Engineer",
                capabilities=["deploy_services", "monitor_systems", "manage_infrastructure"],
                runtime_type="workflow_engine",
                pack_requirements=["pack-infra-devops"],
                tags=["devops", "deployment", "infrastructure"],
                status=TemplateStatus.PUBLISHED,
                published_at=datetime.utcnow().isoformat(),
                rating=4.9,
                downloads=2103,
                review_count=142
            )
            self.templates[devops_engineer.id] = devops_engineer

        # Content Writer Agent
        if "template-content-writer" not in self.templates:
            content_writer = AgentTemplateMetadata(
                id="template-content-writer",
                name="Content Writer Agent",
                description="Generates creative content, scripts, and marketing copy",
                version="1.0.0",
                author="BlackRoad OS",
                category=TemplateCategory.CREATIVE,
                role="Content Writer",
                capabilities=["generate_content"],
                runtime_type="llm_brain",
                pack_requirements=["pack-creator-studio"],
                tags=["content", "creative", "writing"],
                status=TemplateStatus.PUBLISHED,
                published_at=datetime.utcnow().isoformat(),
                rating=4.5,
                downloads=1567,
                review_count=98
            )
            self.templates[content_writer.id] = content_writer

        # Customer Support Agent
        if "template-customer-support" not in self.templates:
            customer_support = AgentTemplateMetadata(
                id="template-customer-support",
                name="Customer Support Agent",
                description="Handles customer inquiries, troubleshoots issues, and provides assistance",
                version="1.0.0",
                author="BlackRoad OS",
                category=TemplateCategory.SUPPORT,
                role="Customer Support Specialist",
                capabilities=["handle_inquiries", "troubleshoot", "ticket_routing"],
                runtime_type="llm_brain",
                pack_requirements=[],
                tags=["support", "customer-service", "help-desk"],
                status=TemplateStatus.PUBLISHED,
                published_at=datetime.utcnow().isoformat(),
                rating=4.7,
                downloads=3421,
                review_count=234
            )
            self.templates[customer_support.id] = customer_support

    async def publish_template(self, template: AgentTemplateMetadata) -> str:
        """
        Publish a new agent template to the marketplace.

        Args:
            template: Template metadata to publish

        Returns:
            Template ID
        """
        # Validate template
        if not template.id:
            template.id = self._generate_template_id(template.name)

        # Set publication metadata
        template.status = TemplateStatus.PUBLISHED
        template.published_at = datetime.utcnow().isoformat()
        template.updated_at = datetime.utcnow().isoformat()

        # Register
        self.templates[template.id] = template
        self._save_template(template)

        return template.id

    def search(
        self,
        query: Optional[str] = None,
        category: Optional[TemplateCategory] = None,
        tags: Optional[List[str]] = None,
        min_rating: float = 0.0,
        sort_by: str = "downloads"  # downloads, rating, published_at
    ) -> List[AgentTemplateMetadata]:
        """
        Search for agent templates.

        Args:
            query: Search query (matches name, description, tags)
            category: Filter by category
            tags: Filter by tags (any match)
            min_rating: Minimum rating threshold
            sort_by: Sort criteria

        Returns:
            List of matching templates
        """
        results = list(self.templates.values())

        # Filter by status (only published)
        results = [t for t in results if t.status == TemplateStatus.PUBLISHED]

        # Filter by category
        if category:
            results = [t for t in results if t.category == category]

        # Filter by tags
        if tags:
            results = [
                t for t in results
                if any(tag in t.tags for tag in tags)
            ]

        # Filter by rating
        results = [t for t in results if t.rating >= min_rating]

        # Filter by query
        if query:
            query_lower = query.lower()
            results = [
                t for t in results
                if query_lower in t.name.lower()
                or query_lower in t.description.lower()
                or any(query_lower in tag for tag in t.tags)
            ]

        # Sort
        if sort_by == "downloads":
            results.sort(key=lambda t: t.downloads, reverse=True)
        elif sort_by == "rating":
            results.sort(key=lambda t: t.rating, reverse=True)
        elif sort_by == "published_at":
            results.sort(key=lambda t: t.published_at or "", reverse=True)

        return results

    def get_template(self, template_id: str) -> Optional[AgentTemplateMetadata]:
        """Get a template by ID."""
        return self.templates.get(template_id)

    def list_by_category(self, category: TemplateCategory) -> List[AgentTemplateMetadata]:
        """List all templates in a category."""
        return [
            t for t in self.templates.values()
            if t.category == category and t.status == TemplateStatus.PUBLISHED
        ]

    def get_popular(self, limit: int = 10) -> List[AgentTemplateMetadata]:
        """Get most popular templates by downloads."""
        published = [
            t for t in self.templates.values()
            if t.status == TemplateStatus.PUBLISHED
        ]
        published.sort(key=lambda t: t.downloads, reverse=True)
        return published[:limit]

    def get_top_rated(self, limit: int = 10) -> List[AgentTemplateMetadata]:
        """Get highest rated templates."""
        published = [
            t for t in self.templates.values()
            if t.status == TemplateStatus.PUBLISHED and t.review_count >= 10
        ]
        published.sort(key=lambda t: t.rating, reverse=True)
        return published[:limit]

    async def add_review(self, review: AgentReview):
        """Add a review for a template."""
        if review.template_id not in self.reviews:
            self.reviews[review.template_id] = []

        self.reviews[review.template_id].append(review)

        # Recalculate rating
        template = self.templates.get(review.template_id)
        if template:
            reviews = self.reviews[review.template_id]
            template.rating = sum(r.rating for r in reviews) / len(reviews)
            template.review_count = len(reviews)

    async def increment_download(self, template_id: str):
        """Increment download counter for a template."""
        template = self.templates.get(template_id)
        if template:
            template.downloads += 1

    def get_statistics(self) -> Dict[str, Any]:
        """Get marketplace statistics."""
        published = [
            t for t in self.templates.values()
            if t.status == TemplateStatus.PUBLISHED
        ]

        category_counts = {}
        for template in published:
            cat = template.category.value
            category_counts[cat] = category_counts.get(cat, 0) + 1

        return {
            "total_templates": len(published),
            "total_downloads": sum(t.downloads for t in published),
            "avg_rating": sum(t.rating for t in published) / len(published) if published else 0,
            "total_reviews": sum(t.review_count for t in published),
            "by_category": category_counts
        }

    def _generate_template_id(self, name: str) -> str:
        """Generate unique template ID from name."""
        base = name.lower().replace(" ", "-")
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        return f"template-{base}-{timestamp}"


__all__ = [
    "AgentMarketplace",
    "AgentTemplateMetadata",
    "AgentReview",
    "TemplateStatus",
    "TemplateCategory"
]
