
# https://fastapi.tiangolo.com/reference/security/#security-tools
# https://jwt.ms/
# https://docs.python.org/3/library/functions.html
# https://pyjwt.readthedocs.io/en/stable/
# https://docs.python.org/3/library/io.html#module-io
#https://learn.microsoft.com/en-us/troubleshoot/entra/entra-id/app-integration/troubleshooting-signature-validation-errors

from typing import Optional, Union
from fastapi import FastAPI, HTTPException, Header, Depends, Security, Request, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials 

from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

from typing import Union, Annotated
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import jwt
import inspect
import requests
import base64

DBG = False 

app = FastAPI()

origins = ["*"];

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET","POST","PUT"],
    allow_headers=["Authorization"],
)

security = HTTPBearer(auto_error=False)

load_dotenv()
def get_env(id: str) -> str:
    import os
    return os.environ[id]
#todo: add these two log files to the dockerfile
#ERROR_LOG = get_env("ERROR_LOG")
#STATUS_LOG = get_env("STATUS_LOG")
AZURE_TENANT_ID = get_env("AZURE_TENANT_ID")
AZURE_CLIENT_ID = get_env("AZURE_CLIENT_ID")

jwks_uri = f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/discovery/v2.0/keys"
jwks = requests.get(jwks_uri).json()

def LOG_MESSAGE(msg,log_file):
    with open(log_file,mode='a') as f:
        time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logging.basicConfig(filename=log_file, 
                            level=logging.INFO, 
                            format='%(time)s - %(levelname)s - %(msg)s') # removed asctime. check if this was needed 
        logger = logging.getLogger(__name__)
        logger.info(msg)

def dprint(sentinel: bool, m: Optional[str], s: Optional[str]) -> Optional[str]:
    if s is None:
        s = ""
    if sentinel == False:
        return "" 
    frame = inspect.currentframe().f_back
    if frame:
        file_name = inspect.getfile(frame)
        line_number = frame.f_lineno
    else:
        return print(f"No File:Line \\O/ {m}{s}")
    return print(f"File: {file_name}, Line: {line_number} \\O/ {m}{s}")

def find_matching_jwk(header):
    for jwk in jwks['keys']:
        if header['kid'] == jwk['kid']:
            dprint(False, "Returning kid:",jwk['kid'])
            return jwk
    return None

def base64url_to_int(val: str) -> int:
    val += "=" * ((4 - len(val) % 4) % 4)
    #val += '=' * (len(val) % 4)
    return int.from_bytes(base64.urlsafe_b64decode(val), 'big')

def create_public_key(n,e) -> rsa.RSAPublicKey:
    n = base64url_to_int(n)
    e = base64url_to_int(e)
    public_key = rsa.RSAPublicNumbers(e,n).public_key()
    return public_key

def create_pem_from_public_key(public_key: rsa.RSAPublicKey) -> bytes:
    pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return pem

def get_email_from_token(token: str):
    contents = jwt.decode(token, options={'verify_signature': False})
    try:
        email = contents['email']
        return email 
    except:
        return None

def verify_token_header(authorization: HTTPAuthorizationCredentials = Security(security)):
    print("auth header", authorization)
    if not authorization:
        dprint(True,"Error Verifying Token:", "")
        return None
    dprint(DBG,"auth header:", authorization)
    token = authorization.credentials.strip()
    print("token:",token)
    header = jwt.get_unverified_header(token)
    dprint(DBG,"header:",header)
    jwk = find_matching_jwk(header)
    if jwk == None:
        dprint(True,"Unable to verify jwk:", jwk)
        return None
    dprint(DBG,"jwk: ",jwk)
    public_key = create_public_key(jwk['n'],jwk['e'])
    pem = create_pem_from_public_key(public_key)
    #TODO convert exception handling to output to log files
    try:
        dprint(DBG, "Getting Claim...",None)
        claims = jwt.decode(
            token,
            pem,
            algorithms=['RS256'],
            audience=AZURE_CLIENT_ID,
        )
        dprint(True, "aud:", AZURE_CLIENT_ID)
        dprint(True,"JWT is valid! Type of claims:",type(claims))
        dprint(DBG,"Claims: ",None)
        for claim in claims:
            dprint(DBG,f"\t{claim}: ",f"{claims[claim]}")
        print(token)
        return get_email_from_token(token)#claims
    except jwt.exceptions.ExpiredSignatureError:
        print("Token has expired")
        return None
    except jwt.exceptions.InvalidAudienceError:
        print("Invalid audience")
        return None
    except jwt.exceptions.InvalidSignatureError:
        print("Invalid signature")
        return None
    except jwt.exceptions.DecodeError as decode_err:
        print(f"Decode Error: {decode_err}")
        return None
    except jwt.exceptions.PyJWTError as e:
        print(f"Other JWT error: {e}")
        return None

categories = [
    "cryptography",
    "web",
    "rev",
    "forensics",
    "osint",
    "programming",
    "puzzles"
]
    
def check_test():
    return "thisisyourjwt" 

@app.get("/debug")
def test(token: Annotated[list, Depends(check_test)]):
    print(AZURE_CLIENT_ID)
    print(AZURE_TENANT_ID)
    return { token: token }

@app.get("/")
def home():
    return { "reached": "/" }

@app.post("/user")
def check_user(req: Annotated[dict, Depends(verify_token_header)]):
    print("req:",req)
    return { "data": req };

@app.post("/challenges")
def challenges(req: Annotated[dict, Depends(verify_token_header)]):
    if req is None:
        print("print the free challenges.")
        challenges = [
            { "id": 1, "name": "waffles", "location": "localhost:1234" },
            { "id": 2, "name": "a", "location": "localhost:1234" },
            { "id": 3, "name": "b", "location": "localhost:1234" },
        ]
        return { "challenges": challenges }
    elif req is not None:
        print("the user created an account and gets access to more material")
        return { "congrats": "you get access to more challenges" }

