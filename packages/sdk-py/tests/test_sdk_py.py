from pathlib import Path

from blackroad_core import Catalog, RoleGuard

FIXTURE = Path(__file__).parent / "fixtures" / "catalog.json"


def test_load_catalog_file(monkeypatch):
    catalog = Catalog.load(str(FIXTURE))
    assert len(catalog.agents) == 2


def test_role_guard():
    policy_path = Path(__file__).parents[3] / "policy" / "role_matrix.yaml"
    guard = RoleGuard(["viewer"], policy_path=str(policy_path))
    assert guard.can_perform("read", "catalog") is True
    assert guard.can_perform("manage", "policy") is False


def test_org_chart_svg_snapshot():
    catalog = Catalog.load(str(FIXTURE))
    svg = catalog.generate_org_chart_svg()
    assert "<svg" in svg
    assert "Alice" in svg
