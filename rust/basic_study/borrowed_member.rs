#[derive(Debug)]
struct Person <'a>{
  name: &'a str,
  occupation: &'a str,
  age: &'a u32
}

#[allow(dead_code)]
impl<'a> Person<'a> {
  fn get_name(&self) -> &'a str {
    self.name
  }
}

fn main() {
  let input = "Ichiro,softwear Developer";
  let values: Vec<&str> = input.splitn(2, ",").collect();

  if values.len() != 2 {
    println!("Invalid input");
    return;
  }

  println!("{:#?}", values);

  let age = 24;
  let other_age = 27;

  let mut person = Person {
    name: values[0],
    occupation: values[1],
    age: &age
  };

  // スコープを抜ける時にスコープ内で宣言された変数は解放される。
  // しかし、その解放順は宣言された順番とは逆順
  // personはother_ageを借用しているが
  // other_ageはpersonよりも先に解放されるため、
  // 宣言の位置を変えることでコンパイルエラーを回避できる

  // let other_age = 27;
  person.age = &other_age;

  println!("{:#?}", person);  
}
