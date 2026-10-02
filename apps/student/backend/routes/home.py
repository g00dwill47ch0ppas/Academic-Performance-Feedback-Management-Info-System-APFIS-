from flask import Blueprint
from flask import render_template
import os
import signal

home_bp = Blueprint(
    "home",
    __name__
)

@home_bp.route("/shutdown", methods=["POST"])
def shutdown():
    os.kill(os.getpid(), signal.SIGINT)

    return "", 204

@home_bp.route("/")
def home():
    return render_template("index.html")


@home_bp.route("/phase1")
def phase1():
    return render_template("phase1.html")


@home_bp.route("/phase2")
def phase2():
    return render_template("phase2.html")


@home_bp.route("/phase3")
def phase3():
    return render_template("phase3.html")


@home_bp.route("/phase4")
def phase4():
    return render_template("phase4.html")


@home_bp.route("/returning")
def returning():
    return render_template("returning.html")