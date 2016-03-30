<?php

function verhoeff($num, $times)
{
    $d = array(
        array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        array(1, 2, 3, 4, 0, 6, 7, 8, 9, 5),
        array(2, 3, 4, 0, 1, 7, 8, 9, 5, 6),
        array(3, 4, 0, 1, 2, 8, 9, 5, 6, 7),
        array(4, 0, 1, 2, 3, 9, 5, 6, 7, 8),
        array(5, 9, 8, 7, 6, 0, 4, 3, 2, 1),
        array(6, 5, 9, 8, 7, 1, 0, 4, 3, 2),
        array(7, 6, 5, 9, 8, 2, 1, 0, 4, 3),
        array(8, 7, 6, 5, 9, 3, 2, 1, 0, 4),
        array(9, 8, 7, 6, 5, 4, 3, 2, 1, 0)
    );
    $p = array(
        array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        array(1, 5, 7, 6, 2, 8, 3, 0, 9, 4),
        array(5, 8, 0, 3, 7, 9, 6, 1, 4, 2),
        array(8, 9, 1, 6, 0, 4, 3, 5, 2, 7),
        array(9, 4, 5, 3, 1, 2, 6, 8, 7, 0),
        array(4, 2, 8, 6, 5, 7, 3, 9, 0, 1),
        array(2, 7, 9, 3, 8, 0, 6, 4, 1, 5),
        array(7, 0, 4, 6, 9, 1, 3, 2, 5, 8)
    );
    $inv = array(0, 4, 3, 2, 1, 5, 6, 7, 8, 9);
    for (;$times > 0; $times--) {
        $c = 0;
        for ($i = strlen($num)-1; $i >= 0; $i--){
            $c = $d[$c][$p[((strlen($num) - $i) % 8)][intval($num[$i])]];
        }
        $num .= $inv[$c];
    }
    return $num;
}

function arc4($msg, $key)
{
    $state = array();
    for ($i=0; $i<256; $i++) {
        $state[$i] = $i;
    }
    $j = 0;
    for ($i=0; $i<256; $i++) {
        $j = ($j + $state[$i] + ord($key[$i % strlen($key)])) % 256;
        $temp = $state[$i];
        $state[$i] = $state[$j];
        $state[$j] = $temp;
    }
    $x = 0; $y = 0;
    $output = "";
    for ($i=0; $i<strlen($msg); $i++) {
        $x = ($x + 1) % 256;
        $y = ($state[$x] + $y) % 256;
        $temp = $state[$x];
        $state[$x] = $state[$y];
        $state[$y] = $temp;
        $output .= sprintf('%02x', ord($msg[$i]) ^ $state[($state[$x] + $state[$y]) % 256]);
    }
    return strtoupper($output);
}

function base64($number) {
    $result = "";
    $dic = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
    while ($number > 0) {
        $result = $dic[$number % 64] . $result;
        $number = floor($number / 64);
    }
    return $result;
}

function controlCode($auth, $number, $nit, $date, $total, $key) {
    $code = "";
    $number = verhoeff($number, 2);
    $nit = verhoeff($nit, 2);
    $date = verhoeff($date, 2);
    $total = verhoeff($total, 2);
    $vf = substr(verhoeff(strval(
        intval($number) +
        intval($nit) +
        intval($date) +
        intval($total))
    , 5),-5);

    $input = array($auth, $number, $nit, $date, $total);
    $idx = 0;
    for ($i=0; $i<5; $i++) {
        $code .= $input[$i] . substr($key, $idx, 1+intval($vf[$i]));
        $idx += 1+intval($vf[$i]);
    }
    $code = arc4($code, $key . $vf);

    $final_sum = 0;
    $total_sum = 0;
    $partial_sum = array(0,0,0,0,0);
    for ($i=0; $i<strlen($code); $i++) {
        $partial_sum[$i%5] += ord($code[$i]);
        $total_sum += ord($code[$i]);
    }
    for ($i=0; $i<5; $i++) {
        $final_sum += floor(($total_sum * $partial_sum[$i]) / (1 + intval($vf[$i])));
    }

    preg_match_all('/.{2}/', arc4(base64($final_sum), $key . $vf), $matched);
    $code = join($matched[0], "-");

    return $code;
}
