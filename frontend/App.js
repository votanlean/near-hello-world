import "regenerator-runtime/runtime";
import React from "react";

import "./assets/css/global.css";

import { login, logout, get_balance, deposit } from "./assets/js/near/utils";

export default function App() {
  // use React Hooks to store balance in component state
  const [balance, setBalance] = React.useState();

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // get_balance is in near/utils.js
      get_balance().then((balanceFromContract) => {
        setBalance(balanceFromContract);
      });
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  );

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>
          <label
            htmlFor="balance"
            style={{
              color: "var(--secondary)",
              borderBottom: "2px solid var(--secondary)",
            }}
          >
            {balance}
          </label>
          ! Welcome to NEAR!
        </h1>
        <p style={{ textAlign: "center", marginTop: "2.5em" }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    );
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <button className="link" style={{ float: "right" }} onClick={logout}>
        Sign out
      </button>
      <main>
        <h1>
          <label
            htmlFor="balance"
            style={{
              color: "var(--secondary)",
              borderBottom: "2px solid var(--secondary)",
            }}
          >
            {balance}
          </label>
          {
            " " /* React trims whitespace around tags; insert literal space character when needed */
          }
          {window.accountId}!
        </h1>
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const { fieldset, amount: fieldAmount } = event.target.elements;

            const amount = parseInt(fieldAmount.value);
            const newBalance = balance + amount;
            // disable the form while the value gets updated on-chain
            fieldset.disabled = true;

            try {
              // make an update call to the smart contract
              // pass the value that the user entered in the greeting field
              await deposit(amount);
            } catch (e) {
              alert(
                "Something went wrong! " +
                  "Maybe you need to sign out and back in? " +
                  "Check your browser console for more info."
              );
              throw e;
            } finally {
              // re-enable the form, whether the call succeeded or failed
              fieldset.disabled = false;
            }

            // update local `greeting` variable to match persisted value
            setBalance(newBalance);
          }}
        >
          <fieldset id="fieldset">
            <label
              htmlFor="amount"
              style={{
                display: "block",
                color: "var(--gray)",
                marginBottom: "0.5em",
              }}
            >
              Deposit
            </label>
            <div style={{ display: "flex" }}>
              <input
                autoComplete="off"
                defaultValue={0}
                id="amount"
                onChange={(e) => setButtonDisabled(e.target.value === balance)}
                style={{ flex: 1 }}
              />
              <button
                disabled={buttonDisabled}
                style={{ borderRadius: "0 5px 5px 0" }}
              >
                Save
              </button>
            </div>
          </fieldset>
        </form>
      </main>
    </>
  );
}
