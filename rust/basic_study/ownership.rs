#[derive(Debug, Clone)]
struct Car {
  manufacture: String,
  model: String,
  top_speed: u32
}

impl Car {
  fn new(manufacture: &str, model: &str, top_speed: u32) -> Car {
    Car {
      manufacture: manufacture.to_string(),
      model: model.to_string(),
      top_speed: top_speed
    }
  }
}

// Drop trait
// データがスコープを抜けた時にそのデータは解放(drop)される
// 構造体にDropトレイトを実装すれば、
// その構造体がメモリから消え去る直前に何かしらの処理を差し込むことができる
// 借用した変数がスコープを抜けた丈ではDropされない
impl Drop for Car {
  fn drop(&mut self) {
    println!("This will be destroyed: {:#?}", self)
  }
}

#[allow(unused)]
fn move_car(car: &Car) {
  // borrow Car: &Car
  println!("move_car has the car: {:#?}", car);
}

#[allow(unused)]
fn borrow_and_change(car: &mut Car) {
  car.model = "Lexus".to_string();
  println!("borrow_and_change the car: {:#?}", car);
}

#[allow(unused)]
fn move_and_change_without_borrow(mut car: Car) -> Car {
  car.model = "Lexus".to_string();
  car // some thing as "return car";
  // ムーブが２回発生している
  // コピーは値をコピーするコストが伴いますがムーブは0コスト
}

#[allow(unused)]
fn get_faster_car_name<'a>(car_a: &'a Car, car_b: &'a Car) -> &'a str {
  if car_a.top_speed > car_b.top_speed {
    car_a.model.as_str()
  } else {
    car_b.model.as_str()
  }
}

fn main() {
  let car = Car::new("Toyota", "Sienta", 200);
  let other_car = car.clone(); // Clone the car
  let mut mutable_car = car.clone();

  println!("{:#?}", other_car);

  move_car(&car);

  println!("{:#?}", &car);

  borrow_and_change(&mut mutable_car);

  // 上記のように借用しないで行う場合
  // 変数がmutであれば再代入ができるので
  // 関数によって変更された値を再びもとの変数に書き戻すことができる
  let mut car_1 = Car::new("Toyota", "Sienta", 200);
  car_1 = move_and_change_without_borrow(car_1);

  let car_borrow = &mut car_1;
  borrow_and_change(car_borrow);

  // 変更不可な借用と変更可能な借用を同時に持つ
  //　両方が同じスコープにある場合ににのみ変更不可な借用と変更可能な借用を同時に持つことができない
  let mut car_2 = Car::new("Toyota", "Sienta", 200);
  {
    let car_borrow_1 = &car_2;
    let another_car_borrow = &car_2;
  }
  let mutable_car_borrow = &mut car_2;


  // Scope shadowing
  {
    let car = Car::new("Toyota", "Aqua", 200);
    println!("Shadowing Car is {:#?}", car);
  };

  // スコープ内で実行された処理の最終行にセミコロンが無ければ
  // その値がスコープの返り値となる
  // 例
  // let mut a = 1;
  // let mut b = {
  //    a += 5;
  //    a
  //  };
  // println!("b is {}", b);
  let mut mutable_car_1 = Car::new("Toyota", "Aqua", 200);
  let mutable_car_1 = {
    let mutable_borrow = &mut mutable_car_1;
    borrow_and_change(mutable_borrow);
    mutable_borrow
  };

  println!("mutable_car_1 is {:#?}", mutable_car_1);
}
