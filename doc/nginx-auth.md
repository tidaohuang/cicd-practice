In NGINX, **authentication** and **authorization** are key elements of securing access to resources. These techniques control **who can access** certain parts of the server and **what they can do** once authenticated. Here are the main techniques and methods available for implementing **authentication** and **authorization** in NGINX:

### 1. **Basic Authentication**

Basic Authentication is the most common and simple method of authentication in NGINX. It works by prompting users to provide a username and password when they attempt to access a protected resource.

- **Authentication**: The server checks the user credentials against a file (usually `.htpasswd`), where usernames and passwords (hashed) are stored.
- **Authorization**: Once authenticated, the user is allowed access to specific parts of the web server.

#### Example Configuration:
```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    location /restricted/ {
        auth_basic "Restricted Area";  # Prompt message
        auth_basic_user_file /etc/nginx/.htpasswd;  # Path to password file

        # Optional: rate-limiting for brute-force protection
        limit_req zone=one burst=5 nodelay;
    }
}
```

**Steps**:
- Create `.htpasswd` file using `htpasswd` (Apache utility) to generate username and password hashes.
  ```bash
  htpasswd -c /etc/nginx/.htpasswd username
  ```
- Ensure proper permissions for the `.htpasswd` file (it should not be readable by others).

### 2. **Digest Authentication**

Digest Authentication is a more secure alternative to basic authentication. Instead of sending the password as plain text (as in Basic Auth), Digest Auth uses a challenge-response mechanism that prevents sending the actual password over the network.

- **Authentication**: Like basic authentication, the server uses a password file (with hashes) to authenticate users, but the password is never sent in plaintext.
- **Authorization**: Once authenticated, users are allowed access to specific resources.

#### Example Configuration:
```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    location /restricted/ {
        auth_digest "Restricted Area";
        auth_digest_user_file /etc/nginx/.htdigest;  # Path to Digest auth file
    }
}
```

To generate a `.htdigest` file:
```bash
htdigest -c /etc/nginx/.htdigest realm username
```

### 3. **Client Certificate Authentication (Mutual TLS Authentication)**

In this method, the server requests a certificate from the client, which is used to authenticate the client. It's commonly used for **mutual TLS** authentication.

- **Authentication**: The server requests a **client certificate** and verifies it against a Certificate Authority (CA).
- **Authorization**: Typically, the user’s certificate (or attributes within it) can be used to authorize the user to access certain resources.

#### Example Configuration:
```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    ssl_client_certificate /etc/ssl/certs/ca.crt;  # Path to CA cert
    ssl_verify_client on;  # Enforce client certificate authentication

    location /restricted/ {
        # Only allow access for clients with valid certificates
        if ($ssl_client_verify != "SUCCESS") {
            return 403;
        }
    }
}
```

In this configuration:
- The server validates the client’s certificate (`ssl_client_certificate`) against a trusted CA certificate.
- If the client does not provide a valid certificate, they are denied access.

### 4. **JWT (JSON Web Token) Authentication**

JWT authentication is typically used for **API authentication** or for **single sign-on (SSO)**. It involves issuing a token after an initial login, which is sent with each subsequent request to authenticate and authorize the user.

- **Authentication**: The server validates the JWT token sent by the client (usually in the `Authorization` header).
- **Authorization**: Based on the payload of the JWT (e.g., user roles), the server can decide what resources the user is authorized to access.

#### Example with NGINX and Lua:
To implement JWT authentication in NGINX, you typically need the **NGINX Lua module** (via `ngx_http_lua_module`), as NGINX does not natively support JWT verification.

```nginx
http {
    lua_shared_dict jwt_cache 10m;  # Shared cache for storing JWTs
    server {
        listen 443 ssl;
        server_name example.com;

        ssl_certificate /etc/ssl/certs/example.com.crt;
        ssl_certificate_key /etc/ssl/private/example.com.key;

        location /restricted/ {
            # Lua script to validate JWT in the Authorization header
            access_by_lua_block {
                local jwt = require "resty.jwt"
                local token = ngx.var.http_authorization
                if not token then
                    ngx.exit(ngx.HTTP_UNAUTHORIZED)
                end

                local jwt_obj = jwt:verify("your_secret", token)
                if not jwt_obj["verified"] then
                    ngx.exit(ngx.HTTP_UNAUTHORIZED)
                end
            }
        }
    }
}
```

This approach:
- Requires you to decode and verify the JWT token, ensuring it is valid and has the appropriate claims for authorization.
- You may need to install additional modules (`lua-resty-jwt` for JWT decoding/verification).

### 5. **IP-Based Access Control (Authorization)**

This method involves **allowing or denying access based on the client’s IP address**. This is commonly used to restrict access to certain locations to specific ranges of IP addresses.

- **Authentication**: No explicit authentication (i.e., no username/password is used).
- **Authorization**: Access is determined based on IP address, which is typically defined in the NGINX configuration.

#### Example Configuration:
```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    location /restricted/ {
        # Only allow access from specific IP range
        allow 192.168.1.0/24;
        deny all;  # Deny all other IPs
    }
}
```

In this case:
- Only users from the `192.168.1.0/24` network can access the `/restricted/` location, and all others will be denied.

### 6. **Third-Party Authentication Systems (OAuth2, LDAP, etc.)**

For more advanced scenarios, such as **SSO (Single Sign-On)** or integration with enterprise authentication systems, you can use protocols like **OAuth2**, **OpenID Connect**, or **LDAP**.

- **OAuth2**: Typically used for **external authorization** (e.g., Google, Facebook login) or for accessing **APIs**.
- **LDAP**: Often used in corporate environments to authenticate users against a directory server.

This can be achieved using **NGINX modules** or **external authentication services**. 

For example, the **nginx-ldap-auth** module or **OAuth2 Proxy** can be integrated to handle authentication with LDAP or OAuth2.

### Conclusion

NGINX provides multiple ways to implement **authentication** and **authorization**:

- **Basic Authentication**: Username/password protection via `.htpasswd`.
- **Digest Authentication**: A more secure variant of Basic Auth.
- **Client Certificate Authentication**: Uses client certificates to authenticate users.
- **JWT Authentication**: Often used in APIs or microservices, relying on tokens.
- **IP-Based Access Control**: Restrict access based on IP address ranges.
- **Third-Party Authentication**: Integration with OAuth2, LDAP, or external SSO systems.

Each technique has its use case depending on your application and security needs, and often, multiple techniques can be used together (e.g., Basic Auth for certain paths, Client Certificate Authentication for others).