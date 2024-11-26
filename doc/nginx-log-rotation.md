The configuration you provided is a **logrotate** configuration for rotating NGINX log files. **Logrotate** is a tool used to manage log files on Linux systems, automatically rotating, compressing, and removing logs based on specified criteria.

Let’s break down each part of the configuration to understand its behavior:

```bash
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 nginx adm
    sharedscripts
    postrotate
        [ -s /run/nginx.pid ] && kill -USR1 `cat /run/nginx.pid`
    endscript
}
```

### Explanation of each directive:

1. **`/var/log/nginx/*.log`**:
   - This specifies the log files that the logrotate configuration applies to. In this case, it includes all `.log` files in the `/var/log/nginx/` directory. Typically, these are `access.log` and `error.log`.

2. **`daily`**:
   - This tells logrotate to rotate the log files **every day**. You can change this to `weekly` or `monthly` if you want to rotate logs less frequently.

3. **`missingok`**:
   - This tells logrotate **not to complain** if the specified log files are missing. If the log file doesn’t exist, logrotate will just skip rotating it and move on without an error.

4. **`rotate 14`**:
   - This specifies that **14 rotations** of the log files should be kept. Once the 15th rotation occurs, the oldest log file will be deleted.

5. **`compress`**:
   - This instructs logrotate to **compress** old log files after rotation. Typically, log files are compressed using gzip, so the rotated logs would become `.gz` files (e.g., `access.log.1.gz`).

6. **`delaycompress`**:
   - This tells logrotate to **delay the compression of log files until the next rotation**. This means that the most recent rotated log file will not be compressed immediately but will be compressed during the next rotation.

7. **`notifempty`**:
   - This tells logrotate **not to rotate the log file if it is empty**. If the log file has no content, it will not be rotated or archived.

8. **`create 0640 nginx adm`**:
   - After the log file is rotated, this directive instructs logrotate to create a **new log file with the specified permissions** (0640). The new file will be owned by the user `nginx` and the group `adm`. 
     - `0640` means:
       - `6`: Read and write permission for the owner (`nginx`).
       - `4`: Read-only permission for the group (`adm`).
       - `0`: No permission for others.
     - The `nginx` user typically owns the running NGINX processes, and `adm` is the typical group for log management.

9. **`sharedscripts`**:
   - This tells logrotate to **run the `postrotate` script only once**, even if multiple log files are rotated. Without this directive, the `postrotate` script would run for each log file being rotated.

10. **`postrotate`**:
    - The `postrotate` section defines a script that is executed **after the logs are rotated**. In this case, the script checks if the NGINX process ID (`/run/nginx.pid`) exists (i.e., NGINX is running), and if so, sends the `USR1` signal to NGINX.
    - The `USR1` signal instructs NGINX to **reopen its log files**. This is important because after log rotation, NGINX needs to start writing to the new log files, and this signal triggers that action.

    ```bash
    [ -s /run/nginx.pid ] && kill -USR1 `cat /run/nginx.pid`
    ```

    - `[ -s /run/nginx.pid ]`: Checks if the NGINX process ID file exists and is not empty.
    - `kill -USR1 `cat /run/nginx.pid``: Sends the `USR1` signal to the process ID read from `/run/nginx.pid`, telling NGINX to reopen the logs.

11. **`endscript`**:
    - Marks the end of the `postrotate` script block.

### Summary of Behavior:
This logrotate configuration will:
- Rotate the NGINX logs daily.
- Keep 14 previous rotations of logs.
- Compress rotated logs but delay the compression of the most recent rotation.
- Skip rotating empty log files.
- Create a new log file with the correct permissions (`0640`, owned by the `nginx` user and `adm` group).
- After rotation, it will send a `USR1` signal to NGINX, instructing it to reopen its log files and start writing to the new log.

This setup ensures that your NGINX logs are managed properly, rotated daily, and the old logs are compressed to save disk space.