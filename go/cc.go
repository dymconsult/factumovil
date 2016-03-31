package main

import "fmt"
import "math"
import "strconv"
import "strings"
import "regexp"

func main() {
	fmt.Println(ControlCode(
		"7904006306693",
		"876814",
		"1665979",
		"20080519",
		"35959",
		"zZ7Z]xssKqkEf_6K9uH(EcV+%x+u[Cca9T%+_$kiLjT8(zr3T9b5Fx2xG-D+_EBS",
	)) //output: 7B-F3-48-A8
}

func verhoeff(num string, times int) string {
	d := [10][10]int{
		{0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
		{1, 2, 3, 4, 0, 6, 7, 8, 9, 5},
		{2, 3, 4, 0, 1, 7, 8, 9, 5, 6},
		{3, 4, 0, 1, 2, 8, 9, 5, 6, 7},
		{4, 0, 1, 2, 3, 9, 5, 6, 7, 8},
		{5, 9, 8, 7, 6, 0, 4, 3, 2, 1},
		{6, 5, 9, 8, 7, 1, 0, 4, 3, 2},
		{7, 6, 5, 9, 8, 2, 1, 0, 4, 3},
		{8, 7, 6, 5, 9, 3, 2, 1, 0, 4},
		{9, 8, 7, 6, 5, 4, 3, 2, 1, 0},
	}
	p := [8][10]int{
		{0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
		{1, 5, 7, 6, 2, 8, 3, 0, 9, 4},
		{5, 8, 0, 3, 7, 9, 6, 1, 4, 2},
		{8, 9, 1, 6, 0, 4, 3, 5, 2, 7},
		{9, 4, 5, 3, 1, 2, 6, 8, 7, 0},
		{4, 2, 8, 6, 5, 7, 3, 9, 0, 1},
		{2, 7, 9, 3, 8, 0, 6, 4, 1, 5},
		{7, 0, 4, 6, 9, 1, 3, 2, 5, 8},
	}
	inv := []int{0, 4, 3, 2, 1, 5, 6, 7, 8, 9}

	for ; times > 0; times-- {
		c := 0
		for i := len(num) - 1; i >= 0; i-- {
			c = d[c][p[(len(num)-i)%8][num[i]-'0']]
		}
		num += strconv.FormatInt(int64(inv[c]), 10)
	}
	return num
}

func arc4(msg string, key string) string {
	var state [256]int
	for i := 0; i < 256; i++ {
		state[i] = i
	}
	j := 0
	for i := 0; i < 256; i++ {
		j = (j + state[i] + int(key[i%len(key)])) % 256
		temp := state[i]
		state[i] = state[j]
		state[j] = temp
	}
	x, y := 0, 0
	output := ""
	for i := 0; i < len(msg); i++ {
		x = (x + 1) % 256
		y = (state[x] + y) % 256
		temp := state[x]
		state[x] = state[y]
		state[y] = temp
		output += fmt.Sprintf("%02x", int(msg[i])^state[(state[x]+state[y])%256])
	}
	return strings.ToUpper(output)
}

func base64(number int) string {
	result := ""
	dic := "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/"
	for number > 0 {
		result = string(dic[number%64]) + result
		number = int(math.Floor(float64(number / 64)))
	}
	return result
}

func ControlCode(auth string, number string, nit string, date string, total string, key string) string {
	code := ""
	number = verhoeff(number, 2)
	nit = verhoeff(nit, 2)
	date = verhoeff(date, 2)
	total = verhoeff(total, 2)
	parseInt := func(n string) int64 { i, _ := strconv.ParseInt(n, 10, 64); return i }
	vf := verhoeff(strconv.FormatInt(
		parseInt(number)+
			parseInt(nit)+
			parseInt(date)+
			parseInt(total), 10), 5)
	vf = vf[len(vf)-5:]

	input := []string{auth, number, nit, date, total}
	idx := 0
	for i := 0; i < 5; i++ {
		code += input[i] + key[idx:idx+1+int(vf[i]-'0')]
		idx += 1 + int(vf[i]-'0')
	}
	code = arc4(code, key+vf)

	final_sum := 0
	total_sum := 0
	partial_sum := []int{0, 0, 0, 0, 0}
	for i := 0; i < len(code); i++ {
		partial_sum[i%5] += int(code[i])
		total_sum += int(code[i])
	}
	for i := 0; i < 5; i++ {
		final_sum += int(math.Floor(float64((total_sum * partial_sum[i]) / (1 + int(vf[i]-'0')))))
	}

	var matched []string
	regex := regexp.MustCompile(`.{2}`).FindAllStringSubmatch(arc4(base64(final_sum), key+vf), -1)
	for _, m := range regex {
		matched = append(matched, m[0])
	}
	code = strings.Join(matched, "-")

	return code
}
