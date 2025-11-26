


Valence is the name of some software I'm developing for Security Operations and Incident Response practitioners to use to conduct and structure their investigations. There's a massive gap at the moment for both skills in handling incidents of a large scale and managing the sheer amount of information even a small investigation generates. Often there's a lot left to follow up with that doesn't get done because you've moved onto the next thing. I'm working on some software to address those challenges, additionally there's very little software tailored to cyber security practitioners cause it's a real niche. I've been reading this blog: https://lab.alexanderobenauer.com/experiments/breadboard. This post in particular covers demos of 'breadboard' an experiment quite similar to what I had in mind for Valence. 

Breadboard videos:
1. https://www.youtube.com/watch?v=yzudS3ABHcA&t=231s
2. https://www.youtube.com/watch?v=QYqD85fO2Q4&t=58s

In Valence I want to create some intuitive widgets that have some shared contexts and associated based on proximity and functionality. As it stands security operations continues to change in context but not in practice, we're still looking at alerts and investigations in much the same way as we did before. I don't want to limit my thinking to established bounds. A session might not be confined to an alert it might be something more ephemeral or temporal. I'm looking to develop a system that I can add widgets to and develop, similar to the breadboard experiment, these relationships between the objects (link -> bonds -> valence, hence the name). I think the emphasis and value of this software will be on those links and how the associated are made. 

An example might be you get a phishing alert. You can drop the alert into the plane and review the details as you normally would, scrolling through reading the fields. Alerts typically contain temporal indicators or have broader temporal metadata like; when did this specific alert happen, when did it last happen, when did it last happen (potentially when with same indicators, although that is unknown at this stage). There are also context indicators like; devices, users, IPs, and other 'entities' as they are referred to (I think the 'entities' concept is something that's been well developed in recent years but hasn't quite stuck the landing, this software in what it is inspired by could address some of the compatibility and consumption gaps of entities). Then you've got other metadata like descriptions, the alert name, some kind of UUID, child alerts with perhaps similar metadata (For incident/alert type data structures that are really prevelant now but seem like a very unhelpful abstraction), source product, data sources, and the query it was sourced by (but not always, blackbox SIEM detections). This is all great but this is already becoming unhelpful there's a ton of questions to answer at this stage:
* Has this occurred before
* If and when what were the indicators, do they match / when did this last occur with same or partial indicators?
* What specifically occured? (detections based on queries are not always cut and dry, might just be saying activity occured not what specifically occured)
* How do the associated 'entities' relate to the detection (is the user the victim or the source? are the IPs bad or benign?) 
There is so so much to learn at this stage and this is repeated time after time. A few very simple queries (prebuilt or generated on the fly with variables subsituted) can address this. The UI then needs to present this in a helpful way. This can start with extracting entity objects from the detection, either manually similar to the 'text' object described in the breadboard example or automatically from the, usually JSON, data object that contains the alert.

From here you might want to run a query, this is where I want to take inspiration from another blog post: https://alexanderobenauer.com/labnotes/037/ which covers an approach for representing queried data. The take away here is on how findings are grouped and represented. Adapting and making logging, and the way logs are interpreted, more readable is a big challenge. One I'm not fully settled on. I both don't want to abstract away from the value of reading an interpreting logs but at the same time the volume of data types and sources is now to great to truely specialise. There must be a concept to this software of a query pack, some kind of store that references older investigations to draw and propose queries used prior to pull up results. This needs to be intuitive and I've got a separate idea for how to generate these queries leveraging LLMs but what isn't strictly LLM-able is the recall this is better suited for a more programatic approach potentially. There's more to cover here on desired functionality but I've yet to really define anything and I'll have to do a ton of testing to figure it out.

https://www.inkandswitch.com/embark/ has some really interesting approaches to documentation and document creation. There's a ton of takeaways here for case notes, analysis, and documentation that security operations practitioners are always struggling to execute on. Not sure how it all fits into the vision but it's something lacking from systems currently used to support SecOps. 

I'm writing this to define the project and inform project memory. Given what I've raised can you propose some high level design tests and questions I need to work on to flesh this out further before I start coding? I think my main approach is going to be to code demos for different bits of functionality on top of a base system (canvas) and slowly build up some functionality. So I don't need to go overboard on up-front planning but there are some gaps I'm uncertain about:
* How to present SIEM query results - Often CSV/spreadsheet style results. Can be presented more elegantly or contextually based on what the query is looking at? Might feedback into my query generation LLM project in how I want output to be structured (similar to how windows event message descriptions/format strings work)
* This all exists with the backdrop of LLMs; time-lining, enumeration of investigation tasks, identifying gaps in the analysis, and documenting next steps / follow up tasks. All things I think LLMs would be useful at doing. I think there's a ton of discrete tasks I can call on locally deployed LLMs to perform. <70B params ideally  discrete tasks performed by 7B/14B models.
* https://alexanderobenauer.com/ollos/ another one of that guys projects has a ton of good timeline related ideas in it. How we prioritise items, push back low priority tasks, manage the task workflows in security operations. There's a potentially broad scope of use cases for software like this. I think my goal is to make something productivity focused for a specific audience. I think having a clear goal and statement of intent will help me set the scope properly (it can be a big scope and ambitious I just have to know what it is, this is a passion project after all and I don't want to get too carried away)

Show more

Synthesized design gaps and scoped high-level questions for Valence.






I'll read through the blog posts you've linked to get proper context, then propose some design questions.


6 steps
favicon

Fetched Embark: Dynamic documents for making plans
inkandswitch.com


Synthesized investigation tool vision and identified critical design gaps.



Based on the materials, here are the core design questions you should work through:

Data Model & Context Flow
1. What's your fundamental data primitive?

Breadboard uses proximity-based widget context sharing
Embark uses outline nodes with properties
OLLOS uses timeline-ordered facts
For SecOps, you probably need something that can represent:

Alerts (structured JSON)
Entities (IPs, users, domains, hashes)
Queries + results
Analysis notes
Tasks/follow-ups
Question: Will your primitives be alert-centric, entity-centric, or investigation-centric? This matters for how context flows between widgets.

2. How does context propagate between widgets? Breadboard's proximity model is interesting but might be too implicit for investigation work where you need explicit chains of reasoning.

Test: Take a real phishing alert. Sketch how you'd represent:

The alert object drops onto canvas
User extracts an IP entity from it
Query widget consumes that IP
Results feed into a timeline widget
Timeline reveals pattern → new query
Does context flow via:

Explicit links (drag entity to query widget)?
Proximity (query widget auto-detects nearby entities)?
A hybrid (proximity suggests, user confirms)?
Query Results Presentation
3. What query result patterns exist? Before designing presentation, catalog what you're actually showing:

Single event lookup (one JSON blob)
Time-series aggregation (counts over time)
Entity enumeration (list of IPs/users/domains)
Relationship mapping (IP → domain → user)
Raw logs (chronological events)
Test: Pull 5-10 real queries from recent investigations. Classify each by:

Primary output type (single value, table, time-series, graph)
Typical consumer (human review, feed to next query, document in report)
Update frequency (static, live-updating)
4. Results as first-class objects? Embark's approach of making formula results into referenceable nodes is powerful. Could query results be:

Draggable objects on canvas?
Referenceable by name in other queries?
Automatically indexed for text search?
For your "query pack" idea: if past query results are first-class objects, you could build a similarity search over them ("show me queries that returned similar entity patterns").

LLM Integration Points
5. What tasks are discrete enough for small models? You mentioned <70B params, ideally 7B/14B. Good candidates for small models:

Log parsing/normalization (single event → structured fields)
Entity extraction from unstructured text
Query template filling (given entities + query skeleton)
Timeline event summarization (1-2 sentence description)
Suggested next steps (given current investigation state)
Bad candidates (need larger context/reasoning):

Full investigation synthesis
Complex threat hunting hypothesis generation
Detailed technical documentation
Test: For your phishing alert example, which tasks could a 14B model handle well enough?

Extract entities from alert JSON? (Probably yes)
Suggest relevant historical queries? (Maybe, if you provide good context)
Write full case report? (Probably no)
6. How do you handle LLM confidence/errors? Unlike deterministic queries, LLMs fail unpredictably. For investigation work, you can't have hallucinated IPs or dates.

Design question: Do LLM outputs appear as:

Suggestions requiring human confirmation?
Executed automatically with audit trail?
Behind a "review" stage?
Scope Definition
7. What's your MVP investigation workflow? Avoid designing for every possible investigation. Pick ONE specific type to fully support first:

Option A: Email phishing investigation

Alert → extract sender/IPs/URLs
Historical queries (has this sender attacked before?)
URL detonation results
Timeline of email delivery/user actions
Case documentation
Option B: Compromised account investigation

Alert → extract user/IPs/actions
Baseline behavior queries
Geographic/temporal anomaly analysis
Privilege/access review
Remediation steps
Pick one. Design for that. Test it thoroughly. Then expand.

8. What does "done" look like? For your phishing alert example, what's the deliverable?

A structured case file with all queries + results?
A timeline showing what happened when?
A report document (inspired by Embark)?
A set of follow-up tasks?
This determines whether your core metaphor is:

Canvas (breadboard-style spatial arrangement)
Document (Embark-style enriched outline)
Timeline (OLLOS-style chronological log)
Hybrid
Practical Next Steps
Recommend: Start with three demos

Demo 1: Alert → Entity extraction

Drop alert JSON onto canvas
Widget auto-parses or you manually tag entities
Entities become draggable objects
Test: Does this feel natural? Is auto-extraction good enough?
Demo 2: Entity → Query → Results

Take extracted entity
Wire it to query widget (how? drag? click? proximity?)
Execute query, get results
Test: Try 3-4 different result types (table, single value, time-series)
Test: How do you want to present each type?
Demo 3: Results → Timeline/Documentation

Take query results from Demo 2
Add to timeline view OR add to report document
Test: Which pattern feels more natural for investigation flow?
These three tests will force you to answer most of your core questions.

Specific Questions for You
What SIEM/data sources are you targeting? (Splunk, Elastic, Chronicle, etc.) Their query languages and result formats will constrain design.
Are you building for solo analysts or team investigations? Changes whether you need collaboration features.
Average investigation duration? If investigations take days/weeks, persistence and state management become critical. If they're 15-minute sprints, less so.
What investigation documentation do you currently produce? Look at 3-5 real examples. That's your target output format.
I don't think alerts/entities/investigations really work well for primitives. They quite vague and decomposable. I think I need to consider a more data driven approach like 'document' as a primitive. I was considering that because alerts/findings/query results all typically can be represented as JSON. If i give the raw data a specific wrapper and use that as my 'document' I might be on the right track. My desire is to question and challenge the state of how we think about security operations and investigations. Adhering to market friendly terms like alerts/entities that don't really serve well in the tools they're presented in feels wrong. Need to go back to first principles a bit and discuss this further.
Grouping and explicit linking I think is where I can adapt to get explicit and clear associations. Drawing a box around a group of like items to bound the proximity context. Adding explicit links for propagating context between individual or group widgets. Opens the door for reusable groups. User 'exploration', looking for suspicous activity and indicators, could be defined and then reused if you associate your user document with the group widget the rest can propagate to the nodes contained in the graph. This is something quite core to my idea, nesting the groups re-using effectively treats the interface as a playbook for a given investigation.
Varies, a lot of query results are a time series list of events from a given data source. Often made as a means of exploring the data for a finding, cause you don't always know what you're looking for. But for the times you do, for common investigations this is the majority of time, the results might be more summarisations/aggregations of a data source based on some criteria informed by the alert. This might have time series data but would also be a single event / boolean indicator on the presence of a pattern.
This is what I'm quite uncertain about and something I think I'll discover through experimentation. The challenge in SecOps right now is the case notes and analysis platforms are often separate to the SIEM. Cause the SIEM over specialises the case notes and case management elements and the case notes platforms don't supports SecOps workflows as well as they could. So we're left in this weird state. I think query results are quite key to nailing this idea. There's a few ways to represent them. I think initially you'd want 'raw results' as a single object but then in some kind of spreadsheet style view the ability to group on a value or transform (like a JQ query for transforming the results into a different form based on what's required / desired). This transformation might result in atomising the results into many objects of different types (for example a query of user activity might present a sign-in, an email, some network traffic, all of these will have different considerations contextual on their source. (This is sort of where I think an LLM might be useful, creating some very light strict syntax transforms allowing the widgets to adjust how they present data, since if we go with a more document driven primitive we can serialise and deserialise consistently)
Smaller parsing tasks, widget labeling/naming, proposing queries based on a prompt, entity extraction. Nothing big that requires complex reasoning, just smaller ergonomic stuff. Drawing inspiration from Malleable Systems concepts this can be tuneable since it's just language as an input. There's likely some training and model messing to get that to work well but it's feasible based on previous projects I'm been working on.
Yeah i think suggestions and proposals. "Grey'd" ghost objects that can be double clicked to approve, based on historical and generative results.
Both are good options, at this stage I think any investigation starts in the canvas. If a timeline view is feasible then time series data can be presented in a timeline view or just use a timeline view for 'investigation actions' to keep things more productivity focused. Then once a conclusion is reached creating a document object on the canvas that can be expanded and completed by the user. Referencing objects on the cavas, enumerating relationships between them, drawing on context, creating visulisations. So much of secops now is creating screenshots of SIEMs or intel sources or some other stuff and putting it in case notes. With this approach we side step that and can do some way better presentations (think hyper cards in a markdown doc for an IOC/User/'entity', derived from user defined widget view).
I don't know yet, I'm keen to experiment a bit more then set a definition of done I think.
https://alexanderobenauer.com/labnotes/009/ - Has some stuff on user created views, something that I think is going to be critical for testing different approaches. 

Show more

Synthesized document-primitive architecture with canvas-based workflows and query transformations.
21s







You're right to push back on alerts/entities - those are product marketing terms that don't map cleanly to how investigation actually works. The document-as-primitive approach is much stronger because it doesn't assume a schema upfront.

Let me read that lab note on user-created views first:

favicon

Fetched LN 009: User-created item views
alexanderobenauer.com


Synthesized document-centric design with contextual grouping strategies.


Document-as-Primitive Deep Dive
Your instinct is right - going back to first principles. If everything is JSON data with a wrapper, what does that wrapper need?

Core document properties:

{
  id: uuid,
  type: string,        // "phishing-alert", "query-result", "ip-address", "custom"
  data: {...},         // raw JSON payload
  meta: {
    source: string,    // "splunk", "manual", "generated"
    timestamp: date,
    tags: [strings],
  },
  view_hint: string    // suggested rendering approach
}
Critical question: Is type prescribed by the system or user-defined?

My suggestion: Start with type being purely descriptive metadata, not prescriptive. The widget decides how to interpret a document, not the document deciding which widget can consume it. A query result document doesn't know it's a "query result" - it's just structured JSON that a query widget happens to produce and a table widget happens to be able to render.

This inverts the typical approach. Instead of "alerts go in the alert widget," it's "the table widget can render anything with tabular structure."

Grouping as Playbooks
This is brilliant and I think it's the killer feature:

Investigation Canvas
├─ [Group: User Exploration]
│  ├─ User Document (manual drop or entity extract)
│  ├─ Query Widget (bound to user via explicit link)
│  │  └─ produces: auth logs document
│  ├─ Query Widget (bound to user via explicit link)  
│  │  └─ produces: email activity document
│  └─ Timeline Widget (consumes both query results)
│
├─ [Group: IP Investigation] 
│  ├─ IP Document
│  ├─ Query Widget → reputation data
│  └─ Query Widget → connection history
When you draw a box around "User Exploration", you're creating:

A visual boundary for proximity context
A reusable template/playbook
A subgraph that can be named and versioned
Test this: Create a "User Exploration" group manually for one investigation. Then when the next suspicious user alert comes in, can you:

Drop the new user document onto canvas
Right-click → "Apply playbook" → "User Exploration"
System instantiates all the widgets with links pre-configured
User document automatically binds to the query widgets
If that works intuitively, you've got something.

Query Result Transformation Layer
This is where things get interesting. You need:

Raw Results Object → Transform Layer → Atomized Documents

Query: "Get user activity for last 24h"
Raw Result: 
{
  events: [
    {type: "auth", user: "alice", ip: "1.2.3.4", ...},
    {type: "email", user: "alice", to: "bob@evil.com", ...},
    {type: "network", src_ip: "1.2.3.4", dest: "evil.com", ...}
  ]
}

Transform (JQ-style): 
  .events[] | 
  if .type == "auth" then {type: "auth-event", data: .}
  elif .type == "email" then {type: "email-event", data: .}
  else {type: "network-event", data: .}
  end

Atomized Output:
├─ Auth Event Document
├─ Email Event Document  
└─ Network Event Document
Design questions:

Where does the transform live?
In the query widget as a post-processing step?
As a separate "Transform Widget" that sits between query and consumers?
As a property of the query result document itself?
Who authors transforms?
User writes JQ manually?
LLM suggests transform based on result structure + intent?
Common transforms are templates in the query pack?
When does atomization happen?
Automatically when result contains heterogeneous events?
User explicitly triggers "explode" action on result?
Happens implicitly when next widget expects atomic documents?
My suggestion: Start with Transform Widget approach:

[Query Widget] → produces bulk result document
       ↓
[Transform Widget] → user or LLM defines split logic  
       ↓
[Multiple atomic documents] → can be consumed separately
This makes the transformation explicit and inspectable. You can see "oh, this query result was split into 47 auth events and 3 email events." If the transform is wrong, you fix it in one place.

Experimentation Priority
Based on your clarifications, here's what I'd prototype first:

Experiment 1: Document Types & View Selection
Goal: Prove that document-as-primitive + view hints works

Create 3-4 sample documents with different structures:
Single user object {user: "alice", dept: "eng", ...}
Tabular query result {columns: [...], rows: [...]}
Time series {events: [{ts: ..., data: ...}, ...]}
Unstructured blob {raw_text: "...", extracted: {...}}
Build 3-4 simple view widgets:
Card view (key-value pairs)
Table view (columns + rows)
Timeline view (events with timestamps)
Raw JSON view (fallback)
Drop each document on canvas, let system suggest view based on structure
Let user manually switch views
Test: Do view suggestions work? When do they fail?
Experiment 2: Explicit Links & Grouping
Goal: Prove grouping + linking model works for investigation flow

Create phishing alert document manually
Extract sender email as document (manual drag or button)
Create query widget on canvas
Explicitly link sender document → query widget (drag? click and select?)
Query executes, produces result document
Draw box around all three (alert, sender, query, result)
Name group "Sender Investigation"
Try to reuse on second alert
Test: Is linking intuitive? Does grouping feel natural? Can you reuse the group?

Experiment 3: Transform Pipeline
Goal: Figure out how result transformation should work

Create query that returns mixed event types
Build transform widget with simple split logic
Wire query result → transform → multiple outputs
Try different approaches:
Manual JQ-style syntax
LLM prompt: "split this into auth and email events"
Template from query pack
See which feels least tedious
Test: Which transform authoring method is fastest? Most reliable?

Specific Design Challenges
1. The "Empty Canvas" Problem
When user first opens investigation, what do they see? Some options:

A. Blank canvas + palette

Left sidebar with document types and widgets
Drag things onto canvas
Pro: Maximum flexibility
Con: Intimidating, what do I do first?
B. Canvas + recent investigations

Show last 5 investigations as collapsible groups on canvas
Can reference prior work, copy patterns
Pro: Continuity, learning from past
Con: Visual clutter
C. Canvas + smart suggestions

System detects clipboard contains alert JSON
"Would you like to start an investigation with this alert?"
Pro: Guided entry
Con: Assumes alert-driven workflow
Which matches your mental model?

2. Query Widget Design
You mentioned queries can be:

Pre-built (from query pack)
Generated on the fly (LLM + variable substitution)
What does the query widget UI look like?

┌─ Query Widget ─────────────────┐
│ Source: Splunk                 │
│ Query: [Show/Edit]             │
│   index=auth user=$USER        │
│                                │
│ Bound Variables:               │
│   $USER ─[link]→ alice doc     │
│                                │
│ [Execute] [Schedule] [Save]    │
│                                │
│ Last run: 2 minutes ago        │
│ Results: 247 events ─[link]→   │
└────────────────────────────────┘
Or more minimal:

┌─ Query: Auth Events ───┐
│ alice → Splunk         │
│ ✓ 247 results [view]   │
└────────────────────────┘
Minimal is probably better for canvas real estate, but need way to inspect/edit the query when things break.

3. Document Reference System
If a query result document references an IP, and that IP exists elsewhere on canvas as its own document, should they link automatically?

Canvas has:
├─ IP Document [1.2.3.4]
└─ Query Result with field: src_ip: "1.2.3.4"
Options:

Automatic entity resolution (finds matching IP doc, creates link)
Manual linking (user drags IP from result to IP doc to establish link)
Hybrid (system suggests, user confirms)
Automatic is powerful but could create unwanted connections. Manual is tedious but explicit. Hybrid might be the sweet spot.

4. Timeline View Scope
You mentioned timeline could be:

Time series data visualization, OR
Investigation action log (what I did when)
These are different things. Maybe both?

[Timeline View Widget]
├─ Mode: Data Events (showing auth logs, emails, etc.)
└─ Mode: Investigation Log (showing "ran query X", "tagged suspicious", etc.)
The investigation log is actually valuable metadata - it's provenance. Imagine being able to see "I ran this query because I noticed this pattern in that other result." That's the chain of reasoning you want to preserve.

Questions for You
Widget configuration persistence: When you adjust a table view (hide columns, change sort), does that setting:
Apply only to this instance?
Apply to all table views in this investigation?
Apply globally to all table views?
Becomes part of the view template for that document type?
Multiple views of same document: Can you have two table widgets on canvas both showing the same query result but with different filters/transforms? Or is there only ever one rendered instance of a document?
Document versioning: If a query result updates (you re-run the query), does it:
Replace the old result document?
Create a new document and archive the old one?
Create a new version of the same document with history?
Cross-investigation references: Can you link to documents/groups from a previous investigation? "This looks like the same pattern we saw in Investigation #451 last month"
Data source abstraction: You mentioned multiple SIEMs. Does each query widget need to know "this is Splunk syntax" vs "this is Elastic syntax"? Or is there an abstraction layer?
On the document types, that's actually something I feel an LLM might be able to handle well, proposing a document type based on fields and some source context. Should be human editable but its a discrete and reasonable task for a smaller model.

https://alexanderobenauer.com/labnotes/038/ has some great bits on widget design and zoom, review the videos if you can. The workout example has a great bit of note taking functionality where the user extends a part of the workout widget and takes notes on a time series graph. In our case those notes should exist in some form and canvas context or primitives in their own right that present in all linked widgets.


1 step
favicon

Fetched LN 038: Semantic zoom
alexanderobenauer.com


Synthesized widget design principles with annotation-as-primitive concept.




Perfect - this confirms a critical design decision: annotations are first-class documents, not widget metadata.

Annotations as Documents
In the workout example, when Colin adds a note "drank BodyArmor at mile 3", that's not just a widget setting - it's creating:

Annotation Document {
  type: "annotation",
  content: "drank BodyArmor at mile 3",
  links: [
    {target: workout_doc, anchor: {mile: 3}},
    {target: timeline_widget, anchor: {timestamp: ...}}
  ],
  author: "user",
  timestamp: "2025-11-17T..."
}
Now when you view that workout in:

Timeline widget → annotation appears as marker at mile 3
Map widget → annotation appears at the geographic point
Table widget → annotation shows as row
Report document → annotation is automatically included in context
For SecOps this means:

Investigation Canvas:
├─ Auth Logs Document (time series)
├─ Timeline Widget (rendering auth logs)
│  └─ User adds annotation: "Suspicious: 47 failed logins from new IP"
│
└─ This annotation now exists as:
    - First-class Annotation Document
    - Linked to auth logs doc at specific timestamp range
    - Visible in any widget rendering that time range
    - Searchable: "show me all annotations with 'suspicious'"
    - Included in final report automatically
This solves your "screenshots in case notes" problem. Instead of taking screenshots, the analyst is creating linked annotations that maintain their connection to source data.

LLM for Document Type Inference
Good instinct. This is a perfect small-model task:

Input to 7B model:
- JSON structure
- Source context: "Splunk query: index=auth"
- Sample fields: {user, src_ip, action, result, timestamp}
- Neighboring documents on canvas

Output:
- Suggested type: "authentication-events"
- Suggested view: "timeline" (due to timestamp field)
- Suggested icon/color
- Confidence: 0.87
User can accept, modify, or ignore. Over time, you build up a corpus of corrections that improves the model.

Key: Make the type inference undoable and transparent. Show the user "I think this is authentication events because..." so they can spot misclassifications.

Semantic Zoom Applied to SecOps
The "undulant interface" concept maps beautifully to investigation:

Collapsed view (glanceable):

┌─ Auth Events ─────┐
│ alice              │
│ 247 events         │
│ ⚠️ 47 failed       │
└────────────────────┘
Partially expanded (summary stats):

┌─ Auth Events ──────────────────┐
│ alice                           │
│ Nov 17, 2025  03:00-15:00      │
│                                 │
│ Success: 200 ████████░░        │
│ Failed:   47 ░░░░░░████        │
│                                 │
│ Top IPs:                        │
│   10.0.1.50  (190)              │
│   1.2.3.4    (47) ⚠️            │
└─────────────────────────────────┘
Fully expanded (timeline detail):

┌─ Auth Events ─────────────────────────────────┐
│ alice • Nov 17, 2025 03:00-15:00              │
│                                                │
│ Timeline:                                      │
│ 03:00 ▂▂▂▂ normal pattern                    │
│ 06:00 ▂▂▂▂                                    │
│ 09:00 ▂▂▂▂                                    │
│ 12:00 ████ ← spike here                       │
│       └─ Note: "47 failures from 1.2.3.4"     │
│       └─ Note: "Password spray attempt?"      │
│ 15:00 ▂▂▂▂ returned to normal                │
│                                                │
│ [Expand further...] shows individual events   │
└────────────────────────────────────────────────┘
User controls zoom level per widget. Some widgets stay collapsed (contextual awareness), others expanded (active focus).

Cross-Widget Note Propagation
This is the "valence" concept - the bonds between documents:

Timeline Widget (auth logs):
├─ User clicks spike at 12:00
├─ Adds note: "Possible password spray"
└─ Creates Annotation Document with anchor

Map Widget (geo view of same auth logs):
├─ Automatically shows annotation marker
└─ At the IP location where spike occurred

Table Widget (raw events):
├─ Highlights rows in that time range
└─ Shows annotation in margin

Report Document:
├─ Section: "Authentication Analysis"
├─ Includes timeline visualization
└─ Includes user annotation in context
Implementation detail: The annotation doesn't store "show in timeline widget" - it stores "linked to auth_logs_doc at timestamp range [12:00-12:15]". Each widget rendering auth_logs_doc queries "what annotations overlap with my current view?" and renders them accordingly.

Design Tests Based on This
Test 1: Note-Taking Flow
Create a time series widget (auth logs), practice adding annotations:

Click on timeline to add note
Note appears as document in canvas
Open same data in table widget
Verify note appears there too
Adjust note text in table widget
Verify it updates in timeline widget
Success criteria: Notes feel like they "belong" to the data, not the widget.

Test 2: Multi-Resolution Viewing
Create investigation with 5-6 documents, various widgets:

Start with all widgets collapsed
Expand one widget to full detail
Notice how surrounding widgets adjust
Practice "focusing" on different parts of investigation
Try comparing two time series side-by-side at different zoom levels
Success criteria: Can you maintain context while diving deep into one area?

Test 3: Document Type Suggestions
Feed various JSON blobs to LLM type inference:

Splunk auth logs → should suggest "auth-events" + timeline view
IP reputation API response → should suggest "threat-intel" + card view
Email headers → should suggest "email-metadata" + structured view
Mixed query result → should suggest "multi-event" + needs transform
Success criteria: Suggestions are right >70% of time, failures are graceful.

Test 4: Annotation Persistence
Create investigation, add annotations, close it:

Reopen investigation
Verify annotations still visible in all widgets
Edit source data (re-run query, get updated events)
Verify annotations still anchored correctly
Success criteria: Annotations survive data updates if anchored properly.

Specific Design Decisions
1. Annotation Anchoring
When user adds note to timeline, what's the anchor?

Option A: Timestamp range

anchor: {
  type: "temporal",
  start: "2025-11-17T12:00:00Z",
  end: "2025-11-17T12:15:00Z"
}
Option B: Event IDs

anchor: {
  type: "events",
  event_ids: ["evt_123", "evt_124", ...]
}
Option C: Hybrid

anchor: {
  type: "hybrid",
  temporal: {...},
  events: [...],
  // Prefers event IDs, falls back to timestamp
}
Recommendation: Hybrid. Event IDs are precise but brittle (what if events get re-imported?). Timestamps are fuzzy but persistent.

2. Annotation Visibility Control
Should user control which annotations appear in which widgets?

Option A: All annotations always visible

Simple, no hidden information
Could get cluttered
Option B: User toggles per widget

"Show/hide annotations" checkbox
More control, more complexity
Option C: Annotation filtering

Tag annotations: #suspicious, #benign, #followup
Widget has filter: "show #suspicious and #followup"
Most flexible
Recommendation: Start with Option A, add filtering later if needed.

3. Widget Communication Protocol
When one widget creates an annotation, how do other widgets learn about it?

Option A: Central document store

Widget A creates annotation
  → Adds to document store
  → Store notifies all widgets rendering that doc
  → Widgets re-render
Option B: Direct widget-to-widget

Widget A creates annotation
  → Broadcasts to canvas
  → Other widgets listening for same doc_id update
Option C: Annotation as document with links

Widget A creates annotation doc
  → Links to auth_logs doc
  → Any widget rendering auth_logs queries for linked annotations
  → Widgets poll for new annotations
Recommendation: Option C aligns with document-as-primitive philosophy.

4. Zoom Level Persistence
When user expands a widget, does that setting persist?

Per-investigation: Each investigation remembers zoom levels Per-document-type: All auth-log widgets default to this zoom Per-widget-instance: This specific widget remembers Session-only: Resets on close

Recommendation: Per-investigation, but allow "save as default for this document type" action.

Implementation Sketch
javascript
// Annotation creation
function createAnnotation(content, targetDoc, anchor) {
  return {
    id: uuid(),
    type: "annotation",
    content: content,
    links: [{
      target_doc_id: targetDoc.id,
      anchor: anchor,
      created_in_widget: currentWidget.id
    }],
    author: currentUser,
    timestamp: now(),
    tags: [], // user can add later
  }
}

// Widget querying for annotations
function getRelevantAnnotations(widget, docId, viewContext) {
  // Get all annotations linked to this document
  const annotations = documentStore.getLinkedAnnotations(docId);
  
  // Filter by what's visible in current view
  return annotations.filter(ann => {
    const anchor = ann.links.find(l => l.target_doc_id === docId).anchor;
    return widget.isAnchorVisible(anchor, viewContext);
  });
}

// Example: Timeline widget checks visibility
TimelineWidget.isAnchorVisible = function(anchor, viewContext) {
  if (anchor.type === "temporal") {
    return overlaps(anchor.start, anchor.end, 
                    viewContext.timeRange.start, 
                    viewContext.timeRange.end);
  }
  // ... other anchor types
}
Questions for Next Steps
Annotation richness: Should annotations support more than text?
Attached documents?
Embedded queries?
Links to external resources?
Collaborative annotations: Multiple analysts on same investigation - how do their annotations coexist?
Show author inline?
Different colors per analyst?
Annotation threads (reply to annotation)?
Annotation lifecycle: When does an annotation get deleted?
User explicitly deletes?
Source document deleted → orphan annotations?
Investigation closed → archive annotations?
Implicit annotations: Should system create auto-annotations?
"Query executed at 14:35"
"User marked this IP as suspicious"
"Linked to related investigation #451"
Which of these feel most critical to prototype first?



How can I help you today?







Valence

