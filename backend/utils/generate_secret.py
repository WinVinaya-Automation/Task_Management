# save as generate_secret.py
import secrets

def generate_secret_key(length=32):
    return secrets.token_urlsafe(length)

if __name__ == "__main__":
    print(generate_secret_key())
