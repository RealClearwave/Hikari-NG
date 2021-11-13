var exec = require("child_process").exec;
var execSync = require("child_process").execSync;

const stringRandom = require("string-random");
const fs = require("fs");

/**
 * 寻找第一个不同字符
 * @param {string} a 
 * @param {string} b 
 * @returns 
 */
function findFirstDiffPos(a, b) {
  var i = 0;
  if (a === b) return -1;
  while (a[i] === b[i]) i++;
  return i;
}
//洛谷:88
function benchmark() {
  var T_CCC = new Date();
  var pai = 0,
    flag = false;
  for (var i = 1; i < 100000000; i += 2) {
    pai += (((flag = !flag) ? 1 : -1) * 1) / i;
  }
  //console.log("圆周率π：" + pai * 4);
  // @ts-ignore
  return new Date() - T_CCC;
}

var time_limit_per_pt = Math.ceil(benchmark() / 88);
var time_limit_compile = 20000;

/**
 * 运行代码并输出结果
 * @param {string} code 
 * @param {string} stdin 
 * @param {boolean} use_time_limit 
 * @param {number} time_limit 
 * @param {number} mem_limit 
 * @param {Function} callback 
 */
var do_compile_out = function (
  code,
  stdin,
  use_time_limit,
  time_limit,
  mem_limit,
  callback
) {
  var r_d_id = stringRandom(16);
  /*console.log(
    "Time Limit is:" +
      time_limit_per_pt * time_limit +
      ", Mem Limit is:" +
      mem_limit
  );*/
  var working_directory = __dirname + "\\submissions\\" + r_d_id;
  var code_file = working_directory + "\\code" + r_d_id + ".cpp";
  var elf_file = working_directory + "\\code" + r_d_id + ".exe";
  var compile_command =
    __dirname +
    "\\MinGW64\\bin\\g++.exe -std=c++14 " +
    code_file +
    " -o " +
    elf_file;
  var judge_command =
    elf_file +
    " < " +
    working_directory +
    "\\data.in > " +
    working_directory +
    "\\data.out";
  var run_ctrl = {};
  if (use_time_limit) {
    run_ctrl = { timeout: time_limit_per_pt * time_limit };
    //console.log(time_limit_per_pt + "," + time_limit);
  }

  fs.mkdir(working_directory, function (err) {
    if (err) return console.error(err);

    fs.writeFileSync(code_file, code);
    exec(
      compile_command,
      { timeout: time_limit_compile },
      function (error, _stdout, _stderr) {
        if (error) {
          console.error(error);
          console.log(_stdout, _stderr);
          callback("CE","Compile Error.", _stderr);
        } else {
          fs.writeFileSync(working_directory + "\\data.in", stdin);
          exec(judge_command, run_ctrl, function (error, _stdout, _stderr) {
            if (error) {
              var ret = execSync(
                "chcp 437 & taskkill /f /im " + "code" + r_d_id + ".exe"
              );
              //console.log("Timeout!");
              if (ret.indexOf("SUCCESS") > 0) {
                callback("TLE", _stdout, _stderr);
              } else {
                callback("RE", _stdout, _stderr);
              }

              //console.error(error);
              console.log(_stdout, _stderr);
            } else {
              var stdout = fs
                .readFileSync(working_directory + "\\data.out")
                .toString()
                .replace(/\s*/g, "")
                .replace(/[\r\n]/g, "")
                .replace(/[\n]/g, "");
              callback("OK", stdout, _stderr);
            }
          });
        }
      }
    );
  });
}

/*
do_judge(
  "#include<bits/stdc++.h>\nusing namespace std;\nint main(){int a,b;cin>>a>>b;cout<<a+b<<endl;return 0;}",
  "1 2",
  "3",
  function(status,stdout){
      console.log("评测完毕！结果：" + status + " 输出：" + stdout);
  }
);
*/

module.exports = {
  do_compile_out,
  time_limit_per_pt,
};
