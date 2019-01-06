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

  fn buy_drink(&mut self, inserted_yen:u32, drink_name: &str) -> (u32, Option<Drink>) {
    let position = self.drinks
        .iter()
        .position(|drink| drink.name == drink_name && inserted_yen == drink.price_in_yen);

    let drink_option = position.map(|pos| self.drinks.remove(pos));
    // remove: 指定の要素を取得しつつベクターから削除する

    let drink_price = drink_option.as_ref().map(|drink| drink.price_in_yen).unwrap_or(0);
    // drink_optionの所有権を借用するために as_ref()を使う
    // as_ref()はOption<T>をOption<&T>に変換

    let change = inserted_yen - drink_price;

    self.cash_balance += drink_price as u64;

    (change, drink_option)
  }
}

fn main() {
  let drink = Drink::new("Dr.Papper", 120);
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

  let buy_result_1 = machine.buy_drink(150, "Dr.Papper");
  println!("Tried to buy a drink, got {:?}", buy_result_1);

  let buy_result_2 = machine.buy_drink(150, "Cider");
  println!("Tried to buy a drink, got {:?}", buy_result_2);

  let buy_result_3 = machine.buy_drink(150, "Grape Soda");
  println!("Tried to buy a drink, got {:?}", buy_result_3);
 
  println!("Machine after buying drinks: {:#?}", machine);
}
