import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, Optional
import json
import rdflib
# from rdflib import ConjunctiveGraph
# from app.config import settings

mime_types = {
    'datacite_json': 'application/vnd.datacite.datacite+json',
    'datacite_xml': 'application/vnd.datacite.datacite+xml',
    'schemaorg': 'application/vnd.schemaorg.ld+json, application/ld+json',
    'html': 'text/html, application/xhtml+xml',
    'html_xml': 'text/html, application/xhtml+xml, application/xml;q=0.5, text/xml;q=0.5, application/rdf+xml;q=0.5',
    'xml': 'application/xml, text/xml;q=0.5',
    'json': 'application/json, text/json;q=0.5',
    'jsonld': 'application/ld+json',
    'atom': 'application/atom+xml',
    'rdfjson': 'application/rdf+json',
    'nt': 'text/n3, application/n-triples',
    'rdfxml': 'application/rdf+xml, text/rdf;q=0.5, application/xml;q=0.1, text/xml;q=0.1',
    'turtle': 'text/ttl, text/turtle, application/turtle, application/x-turtle;q=0.6, text/n3;q=0.3, text/rdf+n3;q=0.3, application/rdf+n3;q=0.3',
    # 'rdf': 'text/turtle, application/turtle, application/x-turtle;q=0.8, application/rdf+xml, text/n3;q=0.9, text/rdf+n3;q=0.9,application/ld+json',
    'rdf': 'application/ld+json;q=0.9, text/turtle, application/turtle, application/x-turtle;q=0.8, application/rdf+xml, text/n3, text/rdf+n3;q=0.7',
    'default': '*/*'
}

def parseRDF(rdf_data, mime_type: str = None, assessment = None, msg: str = ''):
    rdflib_formats = ['turtle', 'json-ld', 'xml', 'ntriples', 'nquads', 'trig', 'n3']

    if type(rdf_data) == dict:
        # JSON-LD should work, added to RDFLib 6.0.1: https://rdflib.readthedocs.io/en/stable/apidocs/rdflib.plugins.parsers.html#module-rdflib.plugins.parsers.jsonld
        rdf_data = json.dumps(rdf_data)
        # jsonld from RDFLib 6.0.1 broken: https://github.com/RDFLib/rdflib/issues/1423
        # rdf_data = json.dumps(rdf_data, indent=2).encode('utf-8')
        # jsonld from pyld broken with schema.org: https://github.com/digitalbazaar/pyld/issues/154
        # rdf_data = json.dumps(jsonld.expand(rdf_data))
        rdflib_formats = ['json-ld']
        # print(rdf_data)

    g = rdflib.ConjunctiveGraph()
    for rdf_format in rdflib_formats:
        try:
            # print(type(rdf_data))
            g.parse(data=rdf_data, format=rdf_format)
            # print(g.serialize(format='turtle', indent=2))
            if assessment:
                assessment.log('Metadata from ' + mime_type + ' ' + msg + ' parsed with RDFLib parser ' + rdf_format, '☑️')
            break
        except Exception as e:
            if assessment:
                assessment.warning('Could not parse ' + mime_type + ' metadata from ' + msg + ' with RDFLib parser ' + rdf_format)
            print(e)
    return g


# def send_email(
#     email_to: str,
#     subject_template: str = "",
#     html_template: str = "",
#     environment: Dict[str, Any] = {},
# ) -> None:
#     assert settings.EMAILS_ENABLED, "no provided configuration for email variables"
#     message = emails.Message(
#         subject=JinjaTemplate(subject_template),
#         html=JinjaTemplate(html_template),
#         mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
#     )
#     smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
#     if settings.SMTP_TLS:
#         smtp_options["tls"] = True
#     if settings.SMTP_USER:
#         smtp_options["user"] = settings.SMTP_USER
#     if settings.SMTP_PASSWORD:
#         smtp_options["password"] = settings.SMTP_PASSWORD
#     response = message.send(to=email_to, render=environment, smtp=smtp_options)
#     logging.info(f"send email result: {response}")


# def send_test_email(email_to: str) -> None:
#     project_name = settings.PROJECT_NAME
#     subject = f"{project_name} - Test email"
#     with open(Path(settings.EMAIL_TEMPLATES_DIR) / "test_email.html") as f:
#         template_str = f.read()
#     send_email(
#         email_to=email_to,
#         subject_template=subject,
#         html_template=template_str,
#         environment={"project_name": settings.PROJECT_NAME, "email": email_to},
#     )


# def send_reset_password_email(email_to: str, email: str, token: str) -> None:
#     project_name = settings.PROJECT_NAME
#     subject = f"{project_name} - Password recovery for user {email}"
#     with open(Path(settings.EMAIL_TEMPLATES_DIR) / "reset_password.html") as f:
#         template_str = f.read()
#     server_host = settings.SERVER_HOST
#     link = f"{server_host}/reset-password?token={token}"
#     send_email(
#         email_to=email_to,
#         subject_template=subject,
#         html_template=template_str,
#         environment={
#             "project_name": settings.PROJECT_NAME,
#             "username": email,
#             "email": email_to,
#             "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
#             "link": link,
#         },
#     )


# def send_new_account_email(email_to: str, username: str, password: str) -> None:
#     project_name = settings.PROJECT_NAME
#     subject = f"{project_name} - New account for user {username}"
#     with open(Path(settings.EMAIL_TEMPLATES_DIR) / "new_account.html") as f:
#         template_str = f.read()
#     link = settings.SERVER_HOST
#     send_email(
#         email_to=email_to,
#         subject_template=subject,
#         html_template=template_str,
#         environment={
#             "project_name": settings.PROJECT_NAME,
#             "username": username,
#             "password": password,
#             "email": email_to,
#             "link": link,
#         },
#     )


# def generate_password_reset_token(email: str) -> str:
#     delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
#     now = datetime.utcnow()
#     expires = now + delta
#     exp = expires.timestamp()
#     encoded_jwt = jwt.encode(
#         {"exp": exp, "nbf": now, "sub": email}, settings.SECRET_KEY, algorithm="HS256",
#     )
#     return encoded_jwt


# def verify_password_reset_token(token: str) -> Optional[str]:
#     try:
#         decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
#         return decoded_token["email"]
#     except jwt.JWTError:
#         return None
