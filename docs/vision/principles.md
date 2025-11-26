# Design Principles

## 1. Documents Over Schemas

**Principle**: The fundamental primitive is a document - structured JSON with minimal wrapper metadata. Not "alerts", "entities", or "incidents".

**Rationale**: Market-friendly terms like "alerts" and "entities" impose assumptions that don't serve analysts well. Going back to first principles: it's all data. Let the data suggest its own categorization.

**Implications**:
- Document types are descriptive, not prescriptive
- Widgets interpret documents, documents don't dictate widgets
- Type inference is a suggestion, always human-editable

## 2. Explicit Over Implicit

**Principle**: Context propagation should be visible and controllable. Proximity suggests, explicit links confirm.

**Rationale**: Investigation work requires clear chains of reasoning. Implicit magic creates confusion about why things are connected.

**Implications**:
- Visual representation of all links
- Grouping creates explicit boundaries
- User confirms LLM suggestions before they take effect

## 3. Composition Over Configuration

**Principle**: Build complex behaviors by combining simple primitives, not through extensive configuration dialogs.

**Rationale**: Investigations are varied and unpredictable. Pre-configured workflows can't anticipate every need. Composable primitives can.

**Implications**:
- Widgets are simple, single-purpose
- Complex behaviors emerge from widget combinations
- Groups/playbooks are user-composed, not system-defined

## 4. Annotations Are Data

**Principle**: Notes and observations are first-class documents, linked to their subjects, visible across all views.

**Rationale**: The analyst's observations are as important as the raw data. They shouldn't be trapped in a single widget or view.

**Implications**:
- Annotations create document relationships
- Any widget viewing annotated data shows relevant annotations
- Annotations survive data updates (within anchor tolerance)

## 5. Proposals Over Automation

**Principle**: LLM outputs appear as suggestions ("grey" proposals) requiring human confirmation, not automatic actions.

**Rationale**: Investigation work can't tolerate hallucinated IPs or dates. Human-in-the-loop for all AI assistance.

**Implications**:
- Visual distinction between confirmed and proposed elements
- Simple confirmation interaction (double-click to accept)
- Audit trail of what was proposed vs. what was accepted

## 6. Local-First

**Principle**: Data lives on the analyst's machine. Network features are additive, not required.

**Rationale**: Investigation data is sensitive. Analysts need to work offline. Cloud sync is a feature, not a dependency.

**Implications**:
- File/folder or SQLite storage
- No required accounts or services
- Export/import for sharing

## 7. Experimentation Over Specification

**Principle**: Discover the right design through building and testing, not through exhaustive upfront planning.

**Rationale**: The value of this software lies in emergent properties - how context flows, how patterns feel, how investigation unfolds. These can't be fully specified in advance.

**Implications**:
- Time-boxed experiments to test hypotheses
- Willingness to discard approaches that don't work
- Documentation captures learnings, not just decisions