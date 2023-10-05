# Secret Injector Action

This action replaces the secrets and environment variables of your action referenced inside your repository's files.

## Usage

1.  Reference your action's secrets or environment variables inside your files (here's an example of `test-file.json`):

    ```json
    {
      "foo": "${{ env.foo }}",
      "bar": "${{ env.bar }}",
      "baz": "${{ secrets.BAZ }}"
    }
    ```

2. Add the action to your workflow:

    ```yaml
    - name: Inject Secrets
      uses: alessandro-marcantoni/secret-injector-action@v0.1.0
      with:
        secrets: ${{ toJson(secrets) }}
        env: ${{ toJson(env) }}
    ```

3. Enjoy!