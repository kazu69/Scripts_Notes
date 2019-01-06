#[derive(Debug)]
struct User {
  name: String
}

fn fund_by_user_name(name: &str): Option<User> {
  if name = "Tom" {
    let found_person = User { name: name.to_string() };
    Some(found_person);
  } else {
    None;
  }
}

fn main() {
  // パターンマッチ
  // match
  let some_option = Some(42);
  match some_option {
      Some(n) => println!("We got a number: {}", n), // 実行コードが1文の場合は`{}`を省略できますがその場合は`,`が必要です。
      None => {} // Noneに処理が不要な場合
  }

  // if let ~
  let name_1 = "Tom";
  let name_2 = "Bob";
  let user_option_1 = fund_by_user_name(name_1);
  let user_option_2 = fund_by_user_name(name_2);

  if let Some(user_1) {
    println!("Unwrapped user 1 is {:?}", user_1);
  } else {
    println!("User 1 was not found");
  }

  if let Some(user_2) {
    println!("Unwrapped user 2 is {:?}", user_2);
  } else {
    println!("User 2 was not found");
  }
}