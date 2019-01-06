## Basic study of Rust

### Implementation of vending machine

debug print

```bash
$ rustc vendor_machine.rs

$ vendor_machine
Tried to buy a drink, got (150, None)
Tried to buy a drink, got (150, None)
Tried to buy a drink, got (150, None)
Machine after buying drinks: VendingMachine {
    drinks: [
        Drink {
            name: "Dr.Papper",
            price_in_yen: 120
        }
    ],
    cash_balance: 0
}
```
