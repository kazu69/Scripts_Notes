fn make_power_function(power: u32) -> Box<Fn(i64) -> i64> {
  Box::new(move |a| a.pow(power))
}

// Boxを返しているのはFnはトレイトであるため、
// 実装によってサイズが異なるため現状のRustでは返り値の型としては指定できません。
// そのためここではFnをBoxでラップする必要があります。

// moveはRustの変数の寿命管理のために必要
// moveがない場合このクロージャはmake_power_functionで定義されたpower変数を直接使用しようとします。
// この変数の寿命はmake_power_functionの実行中のみです。
// moveを使用することでpower変数はクロージャ側にコピーされます。

fn main() {
  let power_function = make_power_function(3);
  println!("2^3 = {}", power_function(2));
}

