/*
 * Example smart contract written in RUST
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://near-docs.io/develop/Contract
 *
 */

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{log, near_bindgen};

const DEFAULT_BALANCE: u8 = 10;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    balance: u8,
}

impl Default for Contract {
    fn default() -> Self {
        Self{balance: DEFAULT_BALANCE}
    }
}

#[near_bindgen]
impl Contract {
    pub fn get_balance(&self) -> u8 {
        return self.balance;
    }
    pub fn deposit(&mut self, amount: u8) {
        log!("Deposit {} token", amount);
        self.balance = self.balance + amount;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_default_balance() {
        let contract = Contract::default();
        assert_eq!(contract.get_balance(), 10)
    }

    #[test]
    fn deposit() {
        let mut contract = Contract::default();
        contract.deposit(5);
        assert_eq!(contract.get_balance(), 15);
    }
}
