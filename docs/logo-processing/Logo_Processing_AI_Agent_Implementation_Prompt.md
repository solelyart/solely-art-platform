# Logo Processing AI Agent: Implementation Prompt

---

## System Context

You are an expert software engineer tasked with building a production-grade **Logo Processing AI Agent** — a comprehensive tool for automated logo segmentation, optimization, enhancement, and asset generation. You have access to detailed planning documents that define the complete scope, architecture, and implementation steps.

---

## Reference Documents

The following documents contain the complete specifications for this project. You must reference them throughout implementation:

### 1. Implementation Guide
**File:** `Logo_Processing_Tool_Implementation_Guide.md`

This document contains:
- Technical architecture for all 7 enhancements (A through G)
- Code examples and pseudocode for each feature
- Library and dependency specifications
- Standalone module architecture designs
- API designs and integration patterns

### 2. Project Plan (Original)
**File:** `Logo_Processing_Tool_Project_Plan.md`

This document contains:
- 16-week timeline with week-by-week breakdown
- 45 tasks with 267 substeps
- Time estimates for each substep (640 total hours)
- Task dependencies and parallel work streams
- Milestone definitions and success criteria
- Resource allocation recommendations

### 3. Project Plan Supplement (Deep-Dive)
**File:** `Logo_Processing_Tool_Project_Plan_Supplement.md`

This document contains:
- Gap analysis identifying 10 critical missing areas
- 55 additional tasks with 198 substeps (400 additional hours)
- Deep-dive coverage for:
  - Data pipeline and model training infrastructure
  - Edge case handling and robustness engineering
  - Accessibility (WCAG 2.1 AA compliance)
  - Internationalization and localization
  - Security hardening and penetration testing
  - Scalability and microservices architecture
  - User research and validation
  - Legal and compliance (GDPR, CCPA)
  - DevOps and operational excellence
  - Algorithm validation and mathematical rigor
- Revised timeline (18 weeks, 1,040 hours)
- Critical path analysis

---

## Project Overview

### Purpose
Build an AI-powered logo processing toolkit that can:
1. Automatically segment logos into components (icon, text, decorative elements)
2. Detect and extract colors with adaptive thresholding
3. Provide interactive refinement through a web-based mask editor
4. Process multiple logos in parallel batches
5. Optimize SVG files and separate vector components
6. Enhance logos using AI (upscaling, denoising, style transfer)
7. Generate standard web assets (favicons, social images, app icons)

### Target Users
- Graphic designers needing to extract logo components
- Developers integrating logos into applications
- Marketing teams generating social media assets
- Small business owners processing brand materials
- Agencies handling multiple client logos

### Technical Stack
- **Language:** Python 3.11+
- **Image Processing:** OpenCV, PIL/Pillow, scikit-image
- **Machine Learning:** PyTorch, Segment Anything Model (SAM)
- **Vector Processing:** lxml, svgpathtools, CairoSVG
- **Web Interface:** Gradio or Streamlit
- **API Framework:** FastAPI
- **Database:** PostgreSQL (for user data, feedback)
- **Cache:** Redis
- **Queue:** RabbitMQ or Redis Streams
- **Containerization:** Docker, Kubernetes

---

## Implementation Instructions

### Phase 1: Foundation (Weeks 1-4)

**Objective:** Build the core segmentation pipeline with color detection and component extraction.

**Reference:** 
- Implementation Guide: Enhancement A (pages 1-15)
- Project Plan: Tasks A.1 through A.9
- Supplement: Tasks A.S1 through A.S3

**Key Deliverables:**
1. K-means color extraction with automatic cluster optimization
2. Adaptive HSV thresholding for color mask generation
3. Contour detection with bounding box extraction
4. Gradient region detection using Sobel operators
5. SAM integration for complex logo segmentation
6. DBSCAN spatial clustering for component grouping
7. Configurable processing pipeline with YAML configuration

**Implementation Steps:**

```
Week 1:
├── A.1: Environment setup (2 days)
│   ├── A.1.1: Create repository structure
│   ├── A.1.2: Configure virtual environment
│   ├── A.1.3: Install dependencies
│   ├── A.1.4: Set up linting and type checking
│   ├── A.1.5: Configure pytest
│   └── A.1.6: Create CI/CD pipeline
│
├── A.2: K-means implementation (3 days)
│   ├── A.2.1: Image loading utilities
│   ├── A.2.2: Pixel extraction with filtering
│   ├── A.2.3: K-means clustering
│   ├── A.2.4: Elbow method optimization
│   ├── A.2.5: Color palette formatter
│   └── A.2.6: Unit tests
│
└── A.3: Adaptive thresholding (2 days)
    ├── A.3.1: Research documentation
    ├── A.3.2: Otsu's method
    ├── A.3.3: Adaptive Gaussian
    ├── A.3.4: Auto-tuning
    └── A.3.5: Comparison tests

Week 2:
├── A.4: HSV segmentation (2.5 days)
└── A.5: Contour detection (2.5 days)

Week 3:
├── A.6: Gradient detection (2 days)
└── A.7: SAM integration (3 days)

Week 4:
├── A.8: DBSCAN clustering (2 days)
└── A.9: Pipeline assembly (3 days)

Parallel (Supplement):
├── A.S1: Training data collection (ongoing)
└── G.S1: User research kickoff
```

**Code Structure:**
```
logo_processor/
├── __init__.py
├── core/
│   ├── pipeline.py          # Main orchestrator
│   └── config.py            # Configuration management
├── color/
│   ├── kmeans_detector.py   # K-means clustering
│   ├── hsv_converter.py     # Color space conversion
│   ├── hsv_range.py         # Dynamic range calculation
│   └── palette.py           # Color palette output
├── segmentation/
│   ├── otsu.py              # Otsu thresholding
│   ├── adaptive.py          # Adaptive thresholding
│   ├── color_mask.py        # Color-based masks
│   ├── morphology.py        # Mask refinement
│   ├── contours.py          # Contour detection
│   └── bounds.py            # Bounding box extraction
├── gradient/
│   ├── sobel.py             # Gradient magnitude
│   ├── direction.py         # Gradient direction
│   └── classifier.py        # Gradient type classification
├── deep/
│   ├── sam_wrapper.py       # SAM model wrapper
│   ├── prompt_generator.py  # Auto prompt generation
│   └── mask_processor.py    # Mask post-processing
├── clustering/
│   ├── dbscan.py            # Spatial clustering
│   └── labeler.py           # Component labeling
└── export/
    ├── cropper.py           # Component cropping
    └── serializer.py        # Result serialization
```

**Validation Criteria:**
- [ ] Color detection accuracy: Delta E < 2 on test palette
- [ ] Segmentation IoU > 0.85 on benchmark dataset
- [ ] Processing time < 2 seconds for standard logos
- [ ] All unit tests passing with > 80% coverage

---

### Phase 2: Interactive UI (Weeks 5-8)

**Objective:** Build web-based interactive mask editor with real-time preview and undo/redo.

**Reference:**
- Implementation Guide: Enhancement B (pages 15-25)
- Project Plan: Tasks B.1 through B.10
- Supplement: Tasks C.S1, C.S2 (Accessibility)

**Key Deliverables:**
1. Gradio-based web interface with responsive layout
2. Canvas-based mask editor with brush, eraser, lasso, magic wand tools
3. Real-time preview via WebSocket
4. Command pattern undo/redo with history visualization
5. Session persistence and recovery
6. Multi-pass refinement workflow
7. User feedback collection system
8. WCAG 2.1 AA accessibility compliance

**Implementation Steps:**

```
Week 5:
├── B.1: Web framework setup (1.5 days)
├── B.2: Image upload component (1.5 days)
└── B.3: Canvas mask editor (2 days)

Week 6:
├── B.4: Advanced editing tools (2.5 days)
└── B.5: Real-time preview (2.5 days)

Week 7:
├── B.6: Command pattern (2 days)
├── B.7: History manager (2 days)
└── B.8: Session persistence (1 day)

Week 8:
├── B.9: Refinement workflow (2.5 days)
└── B.10: Feedback collection (2.5 days)

Parallel (Supplement):
├── C.S1: WCAG compliance audit and fixes
├── C.S2: Color blindness support
└── G.S2: Usability testing round 1
```

**Validation Criteria:**
- [ ] UI response time < 100ms for all interactions
- [ ] User correction rate < 5% after auto-segmentation
- [ ] All WCAG 2.1 AA criteria passing
- [ ] Session recovery works after browser crash

---

### Phase 3: Batch Processing (Weeks 9-10)

**Objective:** Enable parallel processing of multiple logos with automated asset generation.

**Reference:**
- Implementation Guide: Enhancement C (pages 25-32)
- Project Plan: Tasks C.1 through C.6
- Supplement: Tasks F.S1-F.S3 (Scalability)

**Key Deliverables:**
1. Configurable asset specification system (YAML-based)
2. Parallel processing engine with worker management
3. Standard asset generators (favicon, social, app icons)
4. Progress tracking with ETA calculation
5. Batch completion reporting
6. Microservices architecture foundation

**Implementation Steps:**

```
Week 9:
├── C.1: Asset specification system (1.5 days)
├── C.2: Parallel processing engine (2 days)
└── C.3: Input queue management (1.5 days)

Week 10:
├── C.4: Asset generators (2 days)
├── C.5: Output organization (1 day)
└── C.6: Progress tracking (2 days)

Parallel (Supplement):
├── F.S1: Microservices design
├── F.S2: Horizontal scaling
└── I.S1: CI/CD pipeline enhancement
```

**Validation Criteria:**
- [ ] Throughput > 100 logos/minute on 4-core machine
- [ ] Failure rate < 1% on valid inputs
- [ ] All standard assets generated correctly
- [ ] Progress reporting accurate within 10%

---

### Phase 4: SVG Optimization (Weeks 10-12)

**Objective:** Parse, optimize, and separate SVG logo components.

**Reference:**
- Implementation Guide: Enhancement D (pages 32-40)
- Project Plan: Tasks D.1 through D.6
- Supplement: Tasks J.S3 (SVG validation)

**Key Deliverables:**
1. Robust SVG parser with namespace handling
2. Path command tokenizer and converter
3. Douglas-Peucker path simplification
4. Color and spatial-based component separation
5. SVG cleanup and optimization pipeline
6. Multi-format export (SVG, PNG, PDF)

**Implementation Steps:**

```
Week 10 (partial):
└── D.1: SVG parser (2 days)

Week 11:
├── D.2: Path command parser (1.5 days)
├── D.3: Douglas-Peucker simplification (2 days)
└── D.4: Component separation (1.5 days)

Week 12:
├── D.5: SVG optimization (2 days)
└── D.6: Export and conversion (1.5 days)

Parallel (Supplement):
└── J.S3: SVG quality validation
```

**Validation Criteria:**
- [ ] File size reduction > 40% on average
- [ ] Visual fidelity: SSIM > 0.95 vs original
- [ ] Rendering consistency across Chrome, Firefox, Safari, Edge
- [ ] All path types handled correctly

---

### Phase 5: AI Enhancement (Weeks 12-14)

**Objective:** Integrate AI-powered upscaling, enhancement, and style transfer.

**Reference:**
- Implementation Guide: Enhancement E (pages 40-48)
- Project Plan: Tasks E.1 through E.6
- Supplement: Tasks A.S2 (Model fine-tuning)

**Key Deliverables:**
1. Robust API client with retry and rate limiting
2. Image upscaling with quality metrics
3. Logo enhancement pipeline (denoise, sharpen, color correct)
4. Gap detection and inpainting
5. Style transfer for brand consistency
6. Fine-tuned models for logo-specific tasks

**Implementation Steps:**

```
Week 12 (partial):
└── E.1: API client (2 days)

Week 13:
├── E.2: Upscaling integration (2 days)
├── E.3: Enhancement pipeline (2 days)
└── E.4: Gap detection/inpainting (1 day)

Week 14:
├── E.5: Style transfer (2.5 days)
└── E.6: Testing and validation (1.5 days)

Parallel (Supplement):
├── A.S2: Model fine-tuning pipeline
└── H.S1: Privacy compliance
```

**Validation Criteria:**
- [ ] Upscaling: 2x resolution with PSNR > 30dB
- [ ] Style consistency score > 0.9
- [ ] API error rate < 0.1%
- [ ] Processing time < 10 seconds per enhancement

---

### Phase 6: Integration & Release (Weeks 15-18)

**Objective:** Integrate all modules, complete testing, documentation, and prepare for release.

**Reference:**
- Implementation Guide: All sections
- Project Plan: Tasks I.1 through I.5
- Supplement: All remaining tasks

**Key Deliverables:**
1. Unified processing pipeline
2. CLI and REST API interfaces
3. Comprehensive test suite (unit, integration, E2E)
4. Complete documentation site
5. Docker images and Kubernetes manifests
6. Security audit completion
7. Performance benchmarks
8. Production deployment

**Implementation Steps:**

```
Week 15:
├── I.1: Module integration (2.5 days)
└── I.2: CLI and API finalization (2.5 days)

Week 16:
├── I.3: Comprehensive testing (2 days)
├── I.4: Packaging and distribution (1.5 days)
└── I.5: Post-release setup (0.5 days)

Week 17-18 (Buffer/Polish):
├── E.S3: Penetration testing
├── I.S2-3: Monitoring and incident response
├── G.S2: Final usability testing
├── G.6: Documentation polish
└── Bug fixes and optimization
```

**Validation Criteria:**
- [ ] All 108 tasks completed
- [ ] Test coverage > 80%
- [ ] Zero critical security vulnerabilities
- [ ] Documentation 100% complete
- [ ] Performance meets all SLOs

---

## Quality Standards

### Code Quality
- All code must pass linting (flake8, black)
- Type hints required for all public functions
- Docstrings required for all modules, classes, and public methods
- Maximum cyclomatic complexity: 10
- Maximum function length: 50 lines

### Testing Requirements
- Unit test coverage > 80%
- Integration tests for all API endpoints
- Visual regression tests for UI components
- Performance benchmarks for critical paths
- Fuzz testing for all input parsers

### Documentation Requirements
- README with quickstart guide
- API reference (auto-generated from docstrings)
- User guide with tutorials
- Architecture decision records (ADRs)
- Changelog following Keep a Changelog format

### Security Requirements
- All inputs validated and sanitized
- No secrets in code or logs
- Dependencies scanned for vulnerabilities
- OWASP Top 10 compliance
- GDPR and CCPA compliance

---

## Task Tracking Format

Use the following format to track progress:

```
[Enhancement].[Task].[Substep] - [Status] - [Assignee] - [Notes]

Example:
A.2.3 - COMPLETE - @dev1 - K-means clustering implemented, tests passing
B.4.1 - IN_PROGRESS - @dev2 - Lasso tool 80% complete, edge detection needs work
C.S1.2 - BLOCKED - @dev1 - Waiting for accessibility audit results
```

Status values: `TODO`, `IN_PROGRESS`, `REVIEW`, `COMPLETE`, `BLOCKED`

---

## Communication Protocol

### Daily Standups
- What was completed yesterday (reference task IDs)
- What will be worked on today (reference task IDs)
- Any blockers (reference supplement gap categories if applicable)

### Weekly Reviews
- Demo completed features
- Review metrics against validation criteria
- Adjust timeline if needed
- Update risk register

### Milestone Reviews
- Full feature demonstration
- Code review of all new modules
- Documentation review
- Security review checkpoint

---

## Getting Started

1. **Clone the repository and set up environment:**
   ```bash
   git clone <repository-url>
   cd logo-processor
   python -m venv venv
   source venv/bin/activate
   pip install -e ".[dev]"
   ```

2. **Review the planning documents:**
   - Read `Logo_Processing_Tool_Implementation_Guide.md` for technical details
   - Read `Logo_Processing_Tool_Project_Plan.md` for timeline and tasks
   - Read `Logo_Processing_Tool_Project_Plan_Supplement.md` for deep-dive tasks

3. **Start with Task A.1.1:**
   - Create the repository structure as defined in the Implementation Guide
   - Follow the code structure outlined in Phase 1 above

4. **Track progress:**
   - Update task status daily
   - Run tests before marking any task complete
   - Document any deviations from the plan

---

## Prompt Usage Examples

### Starting a New Task
```
I'm starting task A.2.3 (K-means clustering implementation). 
Reference: Implementation Guide, Enhancement A, Task A.2.
Please help me implement the K-means color extraction with automatic 
cluster count optimization using the elbow method.
```

### Debugging an Issue
```
I'm working on task B.5.2 (debounced mask change detection) and 
encountering performance issues. The WebSocket is sending too many 
updates. Reference: Implementation Guide, Enhancement B, Task B.5.
How should I implement efficient debouncing?
```

### Reviewing Against Plan
```
I've completed Enhancement A. Please review my implementation against 
the validation criteria in the Project Plan:
- Color detection accuracy: Delta E < 2
- Segmentation IoU > 0.85
- Processing time < 2 seconds
Here are my benchmark results: [results]
```

### Addressing a Gap
```
I'm implementing the security hardening from the Supplement (Task E.S1).
Reference: Supplement, Task E.S1 (Input Validation & Sanitization).
Please help me implement SVG sanitization to prevent XSS vectors.
```

---

## Success Metrics Summary

| Category | Metric | Target |
|----------|--------|--------|
| **Accuracy** | Segmentation IoU | > 0.85 |
| **Accuracy** | Color Delta E | < 2 |
| **Performance** | Single logo processing | < 2 seconds |
| **Performance** | Batch throughput | > 100/minute |
| **Reliability** | Error rate | < 1% |
| **Reliability** | Uptime | > 99.9% |
| **Quality** | Test coverage | > 80% |
| **Quality** | Security vulnerabilities | 0 critical |
| **UX** | User correction rate | < 5% |
| **UX** | UI response time | < 100ms |

---

## Final Notes

This prompt and the associated planning documents represent approximately **1,040 hours** of development work across **108 tasks** and **465 substeps**. The implementation prioritizes **depth over speed** — each feature should be production-ready before moving to the next.

When in doubt, refer back to the planning documents. They contain the detailed specifications, code examples, and validation criteria needed to build each component correctly.

Good luck with the implementation!
