from flask import Flask


def create_app():
    """
    Application Factory
    """

    app = Flask(
        __name__,
        template_folder="../frontend/templates",
        static_folder="../frontend/static"
    )

    from backend.routes.home import home_bp

    app.register_blueprint(home_bp)

    return app