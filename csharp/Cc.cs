using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
					
public class Cs
{
	static String Verhoeff(String num, int times)
	{
		int[,] d = {
			{0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
			{1, 2, 3, 4, 0, 6, 7, 8, 9, 5},
			{2, 3, 4, 0, 1, 7, 8, 9, 5, 6},
			{3, 4, 0, 1, 2, 8, 9, 5, 6, 7},
			{4, 0, 1, 2, 3, 9, 5, 6, 7, 8},
			{5, 9, 8, 7, 6, 0, 4, 3, 2, 1},
			{6, 5, 9, 8, 7, 1, 0, 4, 3, 2},
			{7, 6, 5, 9, 8, 2, 1, 0, 4, 3},
			{8, 7, 6, 5, 9, 3, 2, 1, 0, 4},
			{9, 8, 7, 6, 5, 4, 3, 2, 1, 0}
		};
		int[,] p = {
			{0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
			{1, 5, 7, 6, 2, 8, 3, 0, 9, 4},
			{5, 8, 0, 3, 7, 9, 6, 1, 4, 2},
			{8, 9, 1, 6, 0, 4, 3, 5, 2, 7},
			{9, 4, 5, 3, 1, 2, 6, 8, 7, 0},
			{4, 2, 8, 6, 5, 7, 3, 9, 0, 1},
			{2, 7, 9, 3, 8, 0, 6, 4, 1, 5},
			{7, 0, 4, 6, 9, 1, 3, 2, 5, 8}
		};
		int[] inv = {0, 4, 3, 2, 1, 5, 6, 7, 8, 9};
		for (;times > 0; times--) {
			int c = 0;
			for (int i = num.Length-1; i >= 0; i--){
				c = d[c, p[((num.Length - i) % 8), int.Parse("" + num[i])]];
			}
			num += inv[c];
		}
		return num;
	}
	
	static String Arc4(String msg, String key)
	{
		int[] state = new int[256];
		for (int i=0; i<256; i++) {
			state[i] = i;
		}
		int j = 0, temp;
		for (int i=0; i<256; i++) {
			j = (j + state[i] + (int)key[i % key.Length]) % 256;
			temp = state[i];
			state[i] = state[j];
			state[j] = temp;
		}
		int x = 0, y = 0;
		String output = "";
		for (int i=0; i<msg.Length; i++) {
			x = (x + 1) % 256;
			y = (state[x] + y) % 256;
			temp = state[x];
			state[x] = state[y];
			state[y] = temp;
			output += ((int)msg[i] ^ state[(state[x] + state[y]) % 256]).ToString("X2");
		}
		return output.ToUpper();
	}
	
	static String Base64(int number) {
		String result = "";
		String dic = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
		while (number > 0) {
			result = dic[number % 64] + result;
			number = (int)Math.Floor((double)number / 64);
		}
		return result;
	}
	
	public static String ControlCode(String auth, String number, String nit, String date, String total, String key) {
		String code = "";
		number = Verhoeff(number, 2);
		nit = Verhoeff(nit, 2);
		date = Verhoeff(date, 2);
		total = Verhoeff(total, 2);
		String vf = Verhoeff((
			Convert.ToInt64(number) +
			Convert.ToInt64(nit) +
			Convert.ToInt64(date) +
			Convert.ToInt64(total)).ToString()
		, 5);
		vf = vf.Substring(vf.Length - 5, 5);
	
		String[] input = {auth, number, nit, date, total};
		int idx = 0;
		for (int i=0; i<5; i++) {
			code += input[i] + key.Substring(idx, 1+int.Parse("" + vf[i]));
			idx += 1+int.Parse("" + vf[i]);
		}
		code = Arc4(code, key + vf);
	
		int final_sum = 0;
		int total_sum = 0;
		int[] partial_sum = {0,0,0,0,0};
		for (int i=0; i<code.Length; i++) {
			partial_sum[i%5] += (int)code[i];
			total_sum += (int)code[i];
		}
		for (int i=0; i<5; i++) {
			final_sum += (int)Math.Floor((double)(total_sum * partial_sum[i]) / (1 + int.Parse("" + vf[i])));
		}

		List<String> matched = new List<String>();
		foreach (Match regexp in Regex.Matches(Arc4(Base64(final_sum), key + vf), @".{2}")) {
			matched.Add(regexp.Value);	
		}
		code = String.Join("-", matched.ToArray());
	
		return code;
	}	
	
}