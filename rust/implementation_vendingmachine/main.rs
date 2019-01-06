#[derive(Debug)]
struct Drink{
  name: String,
  price_in_yen: u32 
}

impl Drink {
  fn new(name: &str, price_in_yen: u32) -> Drink {
    Drink {
      name: name.to_string(),
      price_in_yen: price_in_yen
    }
  }
}

#[derive(Debug)]
struct VendingMachine {
  drinks: Vec<Drink>,
  cash_balance: u64
}

impl VendingMachine {
  fn new() -> VendingMachine {
    VendingMachine {
      drinks: Vec::new(),
      cash_balance: 0
    }
  }

  fn add_drink(&mut self, drink: Drink) {
    self.drinks.push(drink)
  }
}

fn main() {
  let drink = Drink::new("Dr. Papper", 120);
  // let drink = Drink{
  //   name: "Dr. Papper".to_string(),
  //   cash_balance: 120
  // };
  let mut machine = VendingMachine::new();
  // let mut machine = VendingMachine{
  //   drink: Vec::new(),
  //   cash_balance: 0
  // };
  machine.add_drink(drink);
  // machine.drinks.push(drink);
  println!("{:#?}", machine);
}
