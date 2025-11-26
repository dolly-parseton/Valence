# Valence - Project Overview

## Problem Statement

Security Operations and Incident Response practitioners face two compounding challenges:

1. **Information Overload** - Even small investigations generate substantial data across multiple sources, formats, and contexts
2. **Workflow Fragmentation** - Tools are siloed: SIEMs for queries, separate platforms for case notes, spreadsheets for tracking, documents for reports

Current tooling enforces rigid abstractions ("alerts", "entities", "incidents") that don't map cleanly to how investigation actually works. Analysts spend significant effort context-switching, copying data between tools, and maintaining mental models that their tools can't represent.

## Vision

Valence is a canvas-based investigation environment where:

- **Documents are the primitive** - Any structured data (JSON) with a thin wrapper, not predefined schemas
- **Context flows through proximity and links** - Widgets share context based on spatial arrangement and explicit connections
- **Groups become playbooks** - Bounded collections of widgets can be saved and reused across investigations
- **Annotations are first-class** - Notes attach to data, not widgets, appearing everywhere that data is viewed
- **LLMs handle discrete tasks** - Type inference, entity extraction, query suggestions as proposals requiring confirmation

## Core Metaphor

The name "Valence" comes from chemistry - the bonds between atoms. The value of this software is in the **relationships**: how documents connect, how context propagates, how patterns emerge from proximity.

An investigation isn't a linear workflow; it's a spatial exploration. Valence provides the canvas for that exploration.

## Target Users

Solo security analysts and small teams conducting:
- Alert triage and investigation
- Threat hunting
- Incident response
- Post-incident analysis

## Initial Scope

First implementation targets:
- Local-first desktop application (Tauri)
- Single-user investigations
- Mock SIEM integration (Sentinel patterns)
- Local LLM integration via Ollama

## Success Criteria

The software succeeds if analysts can:
1. Move faster from alert to understanding
2. Maintain context across complex, multi-source investigations
3. Preserve and reuse investigation patterns
4. Produce documentation as a byproduct of investigation, not a separate task
