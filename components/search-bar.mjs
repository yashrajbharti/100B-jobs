export class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
        <style>
          .search-wrapper {
                    position: relative;
                    inline-size: 90%;
                    max-inline-size: 900px;
                    margin-inline:auto;
                & > label {
                    position: absolute;
                    inset-inline-start: 10px;
                    inset-block-start: 12px;
                    & path {
                    fill: var(--md-sys-color-outline)
                    }
                }
                & > input[type="search"] {
                    display: block;
                    block-size: 50px;
                    inline-size: 100%;
                    font-size: 1.25rem;
                    font-weight: 400;
                    padding-inline-start: 40px;
                    border-radius: 10px;
                    border: none;
                    background-color: var(--md-sys-color-on-background);
                    -webkit-appearance: textfield;
                    &[type="search"]::-webkit-search-decoration {
                    -webkit-appearance: none;
                    }
                    &::-webkit-search-decoration,
                    &::-webkit-search-cancel-button,
                    &::-webkit-search-results-button,
                    &::-webkit-search-results-decoration {
                    display: none;
                    }
                    &::-webkit-search-cancel-button {
                    position: relative;
                    inset-inline-end: 20px;
                    display: block;
                    -webkit-appearance: none;
                    block-size: 20px;
                    inline-size: 20px;
                    border-radius: 10px;
                    background-size: 100%;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgY3g9IjYiIGN5PSI2IiByPSI2IiBmaWxsPSIjNjc2NzY3IiAvPgogICAgPHBhdGggc3Ryb2tlPSIjZmFmZmZkIiBzdHJva2Utd2lkdGg9IjAuNHB4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIKICAgICAgICBkPSJNOC4yODMzNSA0LjE1MDRDOC4zMTE4NiA0LjEyMTkzIDguMzM0NDggNC4wODgxMyA4LjM0OTkyIDQuMDUwOTFDOC4zNjUzNiA0LjAxMzcgOC4zNzMzMiAzLjk3MzgxIDguMzczMzQgMy45MzM1M0M4LjM3MzM3IDMuODkzMjQgOC4zNjU0NiAzLjg1MzM0IDguMzUwMDYgMy44MTYxMUM4LjMzNDY3IDMuNzc4ODggOC4zMTIwOSAzLjc0NTA0IDguMjgzNjIgMy43MTY1NEM4LjI1NTE1IDMuNjg4MDMgOC4yMjEzNCAzLjY2NTQxIDguMTg0MTMgMy42NDk5N0M4LjE0NjkyIDMuNjM0NTMgOC4xMDcwMyAzLjYyNjU3IDguMDY2NzQgMy42MjY1NUM4LjAyNjQ2IDMuNjI2NTIgNy45ODY1NiAzLjYzNDQzIDcuOTQ5MzMgMy42NDk4M0M3LjkxMjA5IDMuNjY1MjIgNy44NzgyNiAzLjY4NzggNy44NDk3NSAzLjcxNjI3TDUuOTk5NjIgNS41NjY0TDQuMTUwMDIgMy43MTYyN0M0LjA5MjQ1IDMuNjU4NyA0LjAxNDM3IDMuNjI2MzYgMy45MzI5NiAzLjYyNjM2QzMuODUxNTQgMy42MjYzNiAzLjc3MzQ2IDMuNjU4NyAzLjcxNTg5IDMuNzE2MjdDMy42NTgzMiAzLjc3Mzg0IDMuNjI1OTggMy44NTE5MiAzLjYyNTk4IDMuOTMzMzRDMy42MjU5OCA0LjAxNDc1IDMuNjU4MzIgNC4wOTI4MyAzLjcxNTg5IDQuMTUwNEw1LjU2NjAyIDZMMy43MTU4OSA3Ljg0OTZDMy42ODczOCA3Ljg3ODExIDMuNjY0NzcgNy45MTE5NSAzLjY0OTM0IDcuOTQ5MTlDMy42MzM5MiA3Ljk4NjQ0IDMuNjI1OTggOC4wMjYzNiAzLjYyNTk4IDguMDY2NjdDMy42MjU5OCA4LjEwNjk4IDMuNjMzOTIgOC4xNDY5IDMuNjQ5MzQgOC4xODQxNUMzLjY2NDc3IDguMjIxMzkgMy42ODczOCA4LjI1NTIzIDMuNzE1ODkgOC4yODM3NEMzLjc3MzQ2IDguMzQxMzEgMy44NTE1NCA4LjM3MzY1IDMuOTMyOTYgOC4zNzM2NUMzLjk3MzI3IDguMzczNjUgNC4wMTMxOSA4LjM2NTcxIDQuMDUwNDMgOC4zNTAyOEM0LjA4NzY4IDguMzM0ODUgNC4xMjE1MiA4LjMxMjI0IDQuMTUwMDIgOC4yODM3NEw1Ljk5OTYyIDYuNDMzNkw3Ljg0OTc1IDguMjgzNzRDNy45MDczMiA4LjM0MTI0IDcuOTg1MzggOC4zNzM1MSA4LjA2Njc0IDguMzczNDZDOC4xNDgxMSA4LjM3MzQxIDguMjI2MTIgOC4zNDEwNCA4LjI4MzYyIDguMjgzNDdDOC4zNDExMiA4LjIyNTkgOC4zNzMzOSA4LjE0Nzg1IDguMzczMzQgOC4wNjY0OEM4LjM3MzI5IDcuOTg1MTIgOC4zNDA5MiA3LjkwNzEgOC4yODMzNSA3Ljg0OTZMNi40MzMyMiA2TDguMjgzMzUgNC4xNTA0WiIKICAgICAgICBmaWxsPSIjZmFmZmZkIiAvPgo8L3N2Zz4=");
                    @media (prefers-color-scheme: light){
                        background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgY3g9IjYiIGN5PSI2IiByPSI2IiBmaWxsPSJ3aGl0ZSIgLz4KICAgIDxwYXRoIHN0cm9rZT0iIzY3Njc2NyIgc3Ryb2tlLXdpZHRoPSIwLjRweCIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgZD0iTTguMjgzMzUgNC4xNTA0QzguMzExODYgNC4xMjE5MyA4LjMzNDQ4IDQuMDg4MTMgOC4zNDk5MiA0LjA1MDkxQzguMzY1MzYgNC4wMTM3IDguMzczMzIgMy45NzM4MSA4LjM3MzM0IDMuOTMzNTNDOC4zNzMzNyAzLjg5MzI0IDguMzY1NDYgMy44NTMzNCA4LjM1MDA2IDMuODE2MTFDOC4zMzQ2NyAzLjc3ODg4IDguMzEyMDkgMy43NDUwNCA4LjI4MzYyIDMuNzE2NTRDOC4yNTUxNSAzLjY4ODAzIDguMjIxMzQgMy42NjU0MSA4LjE4NDEzIDMuNjQ5OTdDOC4xNDY5MiAzLjYzNDUzIDguMTA3MDMgMy42MjY1NyA4LjA2Njc0IDMuNjI2NTVDOC4wMjY0NiAzLjYyNjUyIDcuOTg2NTYgMy42MzQ0MyA3Ljk0OTMzIDMuNjQ5ODNDNy45MTIwOSAzLjY2NTIyIDcuODc4MjYgMy42ODc4IDcuODQ5NzUgMy43MTYyN0w1Ljk5OTYyIDUuNTY2NEw0LjE1MDAyIDMuNzE2MjdDNC4wOTI0NSAzLjY1ODcgNC4wMTQzNyAzLjYyNjM2IDMuOTMyOTYgMy42MjYzNkMzLjg1MTU0IDMuNjI2MzYgMy43NzM0NiAzLjY1ODcgMy43MTU4OSAzLjcxNjI3QzMuNjU4MzIgMy43NzM4NCAzLjYyNTk4IDMuODUxOTIgMy42MjU5OCAzLjkzMzM0QzMuNjI1OTggNC4wMTQ3NSAzLjY1ODMyIDQuMDkyODMgMy43MTU4OSA0LjE1MDRMNS41NjYwMiA2TDMuNzE1ODkgNy44NDk2QzMuNjg3MzggNy44NzgxMSAzLjY2NDc3IDcuOTExOTUgMy42NDkzNCA3Ljk0OTE5QzMuNjMzOTIgNy45ODY0NCAzLjYyNTk4IDguMDI2MzYgMy42MjU5OCA4LjA2NjY3QzMuNjI1OTggOC4xMDY5OCAzLjYzMzkyIDguMTQ2OSAzLjY0OTM0IDguMTg0MTVDMy42NjQ3NyA4LjIyMTM5IDMuNjg3MzggOC4yNTUyMyAzLjcxNTg5IDguMjgzNzRDMy43NzM0NiA4LjM0MTMxIDMuODUxNTQgOC4zNzM2NSAzLjkzMjk2IDguMzczNjVDMy45NzMyNyA4LjM3MzY1IDQuMDEzMTkgOC4zNjU3MSA0LjA1MDQzIDguMzUwMjhDNC4wODc2OCA4LjMzNDg1IDQuMTIxNTIgOC4zMTIyNCA0LjE1MDAyIDguMjgzNzRMNS45OTk2MiA2LjQzMzZMNy44NDk3NSA4LjI4Mzc0QzcuOTA3MzIgOC4zNDEyNCA3Ljk4NTM4IDguMzczNTEgOC4wNjY3NCA4LjM3MzQ2QzguMTQ4MTEgOC4zNzM0MSA4LjIyNjEyIDguMzQxMDQgOC4yODM2MiA4LjI4MzQ3QzguMzQxMTIgOC4yMjU5IDguMzczMzkgOC4xNDc4NSA4LjM3MzM0IDguMDY2NDhDOC4zNzMyOSA3Ljk4NTEyIDguMzQwOTIgNy45MDcxIDguMjgzMzUgNy44NDk2TDYuNDMzMjIgNkw4LjI4MzM1IDQuMTUwNFoiCiAgICAgICAgZmlsbD0iIzY3Njc2NyIgLz4KPC9zdmc+");
                    }
                    }
                }
            }
        </style>
        <search class="search-wrapper">
        <label for="search">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <title>Search Candidates</title>
                <path d="M17.6541 16.5951L20.5836 19.5231C20.7202 19.6646 20.7958 19.854 20.7941 20.0507C20.7924 20.2473 20.7135 20.4354 20.5745 20.5745C20.4354 20.7135 20.2473 20.7924 20.0507 20.7941C19.854 20.7958 19.6646 20.7202 19.5231 20.5836L16.5936 17.6541C14.6793 19.2943 12.204 20.1292 9.68734 19.9838C7.17065 19.8383 4.80812 18.7237 3.0955 16.8739C1.38287 15.024 0.453292 12.5828 0.501808 10.0624C0.550324 7.54193 1.57317 5.13825 3.35571 3.35571C5.13825 1.57317 7.54193 0.550324 10.0624 0.501808C12.5828 0.453292 15.024 1.38287 16.8739 3.0955C18.7237 4.80812 19.8383 7.17065 19.9838 9.68734C20.1292 12.204 19.2943 14.6793 17.6541 16.5936V16.5951ZM10.2501 18.5001C12.4382 18.5001 14.5366 17.6309 16.0838 16.0838C17.6309 14.5366 18.5001 12.4382 18.5001 10.2501C18.5001 8.06209 17.6309 5.96367 16.0838 4.41649C14.5366 2.86932 12.4382 2.00012 10.2501 2.00012C8.06209 2.00012 5.96367 2.86932 4.41649 4.41649C2.86932 5.96367 2.00012 8.06209 2.00012 10.2501C2.00012 12.4382 2.86932 14.5366 4.41649 16.0838C5.96367 17.6309 8.06209 18.5001 10.2501 18.5001Z"  />
            </svg>
        </label>
          <input type="search" id="search" placeholder="Search Candidates" />
        </search>
      `;
  }

  connectedCallback() {
    const input = this.shadowRoot.querySelector("input");
    const delay = 1200;

    let timer;
    input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent("search", {
            detail: input.value,
            bubbles: true,
            composed: true,
          })
        );
      }, delay);
    });
  }
}
