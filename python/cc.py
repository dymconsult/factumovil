
import math
import re


def verhoeff(num, times):
	d = [
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		[1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
		[2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
		[3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
		[4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
		[5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
		[6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
		[7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
		[8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
		[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
	]
	p = [
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		[1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
		[5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
		[8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
		[9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
		[4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
		[2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
		[7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
	]
	inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]
	for i in range(times, 0, -1):
		c = 0
		for i in range(len(num)-1, -1, -1):
			c = d[c][p[((len(num) - i) % 8)][int(num[i])]]
		num += str(inv[c])
	return num


def arc4(msg, key):
	state = [i for i in range(256)]
	j = 0
	for i in range(256):
		j = (j + state[i] + ord(key[i % len(key)])) % 256
		temp = state[i]
		state[i] = state[j]
		state[j] = temp
	x = y = 0
	output = ''
	for i in range(len(msg)):
		x = (x + 1) % 256
		y = (state[x] + y) % 256
		temp = state[x]
		state[x] = state[y]
		state[y] = temp
		output += "{:02x}".format(ord(msg[i]) ^ state[(state[x] + state[y]) % 256])
	return output.upper()


def base64(number):
	result = ''
	dic = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/'
	while number > 0:
		result = dic[number % 64] + result
		number = math.floor(number / 64)
	return result


def controlCode(auth, number, nit, date, total, key):
	code = ''
	number = verhoeff(number, 2)
	nit = verhoeff(nit, 2)
	date = verhoeff(date, 2)
	total = verhoeff(total, 2)
	vf = verhoeff(str(
		int(number) +
		int(nit) +
		int(date) +
		int(total)
	), 5)[-5:]

	input = [auth, number, nit, date, total]
	idx = 0
	for i in range(5):
		code += input[i] + key[idx:idx+1+int(vf[i])]
		idx += 1+int(vf[i])
	code = arc4(code, key + vf)

	final_sum = 0
	total_sum = 0
	partial_sum = [0, 0, 0, 0, 0]
	for i in range(len(code)):
		partial_sum[i % 5] += ord(code[i])
		total_sum += ord(code[i])
	for i in range(5):
		final_sum += math.floor((total_sum * partial_sum[i]) / (1 + int(vf[i])))

	matched = []
	for regexp in re.findall('.{2}', arc4(base64(final_sum), key + vf)):
		matched.append(regexp)
	code = '-'.join(matched)

	return code
