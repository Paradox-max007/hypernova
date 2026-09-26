#!/usr/bin/env python3
"""Generate Jyothilal Reji's CV PDF — clean, professional, ATS-friendly.
Content grounded in the resume facts from the PRD.
Output: /home/z/my-project/public/jyothilal-reji-cv.pdf
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle,
)
from reportlab.lib.styles import ParagraphStyle

ACCENT = HexColor("#0e9f6e")
INK = HexColor("#1a1d1c")
MUTED = HexColor("#5b6663")
LINE = HexColor("#d8dedb")

W, H = A4
M = 18 * mm

styles = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=22, leading=26, textColor=INK),
    "role": ParagraphStyle("role", fontName="Helvetica", fontSize=10.5, leading=14, textColor=ACCENT),
    "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=8.5, leading=12, textColor=MUTED),
    "h": ParagraphStyle("h", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=INK, spaceBefore=10, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9, leading=13, textColor=INK),
    "muted": ParagraphStyle("muted", fontName="Helvetica", fontSize=8.5, leading=12, textColor=MUTED),
    "item": ParagraphStyle("item", fontName="Helvetica", fontSize=9, leading=12.5, textColor=INK, leftIndent=8, bulletIndent=0, spaceAfter=1.5),
    "job": ParagraphStyle("job", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=INK),
    "jmeta": ParagraphStyle("jmeta", fontName="Helvetica", fontSize=8.5, leading=11, textColor=MUTED),
}


def rule():
    return HRFlowable(width="100%", thickness=0.7, color=LINE, spaceBefore=2, spaceAfter=6)


def section(title):
    return [Paragraph(title.upper(), styles["h"]), rule()]


def bullets(items):
    return [Paragraph(f"• {i}", styles["item"]) for i in items]


doc = BaseDocTemplate(
    "/home/z/my-project/public/jyothilal-reji-cv.pdf",
    pagesize=A4,
    leftMargin=M, rightMargin=M, topMargin=16 * mm, bottomMargin=14 * mm,
    title="Jyothilal Reji — CV",
    author="Jyothilal Reji",
)
frame = Frame(M, 14 * mm, W - 2 * M, H - 30 * mm, id="main", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="page", frames=[frame])])

story = []

# ------------------------------- header -------------------------------
story.append(Paragraph("JYOTHILAL REJI", styles["name"]))
story.append(Spacer(1, 2))
story.append(Paragraph("Full Stack Developer · Data Science · Machine Learning", styles["role"]))
story.append(Spacer(1, 4))
story.append(Paragraph(
    "Kerala, India · Working with clients worldwide &nbsp;|&nbsp; jyothilalreji@gmail.com &nbsp;|&nbsp; "
    "github.com/jyothilalreji &nbsp;|&nbsp; linkedin.com/in/jyothilal-reji",
    styles["contact"],
))
story.append(Spacer(1, 6))

# ------------------------------- summary -------------------------------
story += section("Summary")
story.append(Paragraph(
    "Computer applications graduate building complete digital products — realtime web and mobile applications, "
    "machine-learning pipelines and business-facing websites. Experience spans data science and ML model "
    "development (Python, Scikit-learn, Power BI) through full-stack product development (React, TypeScript, "
    "Supabase, Capacitor), including a delivered client website for a UAE business.",
    styles["body"],
))

# ------------------------------- skills -------------------------------
story += section("Skills")
skill_rows = [
    [Paragraph("<b>Languages</b>", styles["muted"]), Paragraph("Python, SQL, JavaScript, TypeScript, PHP", styles["body"])],
    [Paragraph("<b>Web &amp; Mobile</b>", styles["muted"]), Paragraph("React, HTML, CSS, Django, Tailwind CSS, Supabase, Capacitor", styles["body"])],
    [Paragraph("<b>Data / ML</b>", styles["muted"]), Paragraph("Pandas, NumPy, Scikit-learn, TensorFlow, Keras, Random Forest, SVM, KNN, Neural Networks", styles["body"])],
    [Paragraph("<b>Visualization</b>", styles["muted"]), Paragraph("Power BI, Matplotlib, Seaborn", styles["body"])],
    [Paragraph("<b>Tools</b>", styles["muted"]), Paragraph("Git, AWS, Jupyter, Google Colab, MySQL, WAMP", styles["body"])],
]
skill_table = Table(skill_rows, colWidths=[30 * mm, W - 2 * M - 30 * mm])
skill_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 1.5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
]))
story.append(skill_table)

# ----------------------------- experience -----------------------------
story += section("Experience")
story.append(Paragraph("Data Science Intern — Luminar Technolab, Kochi, Ernakulam", styles["job"]))
story.append(Paragraph("May 2024 – Present", styles["jmeta"]))
story += bullets([
    "Developed and evaluated machine-learning models, improving prediction accuracy by 30%.",
    "Automated data preprocessing pipelines, reducing cleaning time by 15%.",
    "Built Power BI dashboards that improved decision-making efficiency by 20%.",
    "Contributed to data analysis and web application optimisation.",
])

# ------------------------------ projects ------------------------------
story += section("Projects")
projects = [
    ("Quicky — Gamified social connection platform (React, TypeScript, Supabase, Capacitor)", [
        "Realtime multiplayer platform with rooms, chat, friends, coins, gifts, themes and an admin console.",
        "Includes Spin the Bottle (12-player rooms) and multiplayer Ludo with server-authoritative dice.",
    ]),
    ("OT24.AE — Live business website for a UAE client (HTML, CSS, JavaScript)", [
        "Complete digital presence designed, built and delivered end-to-end; live at ot24.ae.",
    ]),
    ("Wind Quality Prediction — ML system (Python, Scikit-learn, Pandas)", [
        "Random Forest and SVM classifiers achieving 85%+ accuracy; reduced prediction error by 15%.",
    ]),
    ("Online Shoe Store — E-commerce (Django, Python, MySQL)", [
        "Transactional order and inventory management supporting 50+ daily transactions across 50+ products.",
    ]),
    ("Doctor Appointment Booking — Web application (PHP, MySQL, JavaScript)", [
        "Online booking with doctor schedules, slot integrity enforced at the database level.",
    ]),
]
for title, points in projects:
    story.append(Paragraph(title, styles["job"]))
    story += bullets(points)

# ------------------------------ education -----------------------------
story += section("Education")
story.append(Paragraph("Bachelor of Computer Applications (BCA) — Mar Augusthinose College, Ramapuram", styles["job"]))
story.append(Paragraph("June 2021 – March 2024 · CGPA 7.46 / 10", styles["jmeta"]))

# --------------------------- certifications ---------------------------
story += section("Certifications")
story += bullets([
    "Data Science Foundations — Great Learning",
    "Data Visualisation With Power BI — Great Learning",
])

# ------------------------------ languages -----------------------------
story += section("Languages")
story.append(Paragraph("English (Fluent) · Malayalam (Native)", styles["body"]))

doc.build(story)
print("CV PDF written to /home/z/my-project/public/jyothilal-reji-cv.pdf")
