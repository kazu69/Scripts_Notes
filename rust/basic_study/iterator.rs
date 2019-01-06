fn main() {
  let mut iter = 0..5;
  
  // basic1
  while true {
    let next_val = iter.nex();
    if next_val.is_some() {
      println!("{}", next_val.unwrap())
    } else {
      break;
    }
  }

  // basic2
  loop {
    match iter.next() {
      Some(num) => println!("{}", num),
      None => break
    }
  }

  // basic3
  while let Some(num) = iterm.next() {
    println!("{}", num)
  }

  // basic4
  for num in iter {
    println!("{}", num);
  }

  // infinity loop
  let inf = 1000..;
  let first_20 = inf.take(20);
  // 最初の20個だけ取得
}
