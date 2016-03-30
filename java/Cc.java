import java.util.List;
import java.util.ArrayList;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class Cc
{
	static String verhoeff(String num, int times)
	{
	    int[][] d = {
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
	    int[][] p = {
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
	        for (int i = num.length()-1; i >= 0; i--){
	            c = d[c][p[((num.length() - i) % 8)][Character.getNumericValue(num.charAt(i))]];
	        }
	        num += Integer.toString(inv[c]);
	    }
	    return num;
	}
	
	static String arc4(String msg, String key)
	{
	    int[] state = new int[256];
	    for (int i=0; i<256; i++) {
	        state[i] = i;
	    }
	    int j = 0, temp;
	    for (int i=0; i<256; i++) {
	        j = (j + state[i] + (int)key.charAt(i % key.length())) % 256;
	        temp = state[i];
	        state[i] = state[j];
	        state[j] = temp;
	    }
	    int x = 0, y = 0;
	    String output = "";
	    for (int i=0; i<msg.length(); i++) {
	        x = (x + 1) % 256;
	        y = (state[x] + y) % 256;
	        temp = state[x];
	        state[x] = state[y];
	        state[y] = temp;
	        output += String.format("%02x", (int)msg.charAt(i) ^ state[(state[x] + state[y]) % 256]);
	    }
	    return output.toUpperCase();
	}
	
	static String base64(int number) {
	    String result = "";
	    String dic = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
	    while (number > 0) {
	        result = dic.charAt(number % 64) + result;
	        number = (int)Math.floor(number / 64);
	    }
	    return result;
	}
	
	public static String controlCode(String auth, String number, String nit, String date, String total, String key) {
	    String code = "";
	    number = verhoeff(number, 2);
	    nit = verhoeff(nit, 2);
	    date = verhoeff(date, 2);
	    total = verhoeff(total, 2);
	    String vf = verhoeff(Long.toString(
	        Long.parseLong(number) +
	        Long.parseLong(nit) +
	        Long.parseLong(date) +
	        Long.parseLong(total))
	    , 5);
	    vf = vf.substring(vf.length()-5);
	
	    String[] input = {auth, number, nit, date, total};
	    int idx = 0;
	    for (int i=0; i<5; i++) {
	        code += input[i] + key.substring(idx, idx + 1+Character.getNumericValue(vf.charAt(i)));
	        idx += 1+Character.getNumericValue(vf.charAt(i));
	    }
	    code = arc4(code, key + vf);
	
	    int final_sum = 0;
	    int total_sum = 0;
	    int partial_sum[] = {0,0,0,0,0};
	    for (int i=0; i<code.length(); i++) {
	        partial_sum[i%5] += (int)code.charAt(i);
	        total_sum += (int)code.charAt(i);
	    }
	    for (int i=0; i<5; i++) {
	        final_sum += Math.floor((total_sum * partial_sum[i]) / (1 + Character.getNumericValue(vf.charAt(i))));
	    }
	
	    List<String> matched = new ArrayList<String>();
		Matcher regexp = Pattern.compile(".{2}").matcher(arc4(base64(final_sum), key + vf));
		while(regexp.find()) matched.add(regexp.group());
		for (int i = 0; i < matched.size(); i++) {
			code += matched.get(i) + "-";
		}
	    code = code.substring(0, code.length()-1);
	
	    return code;
	}	
}

	
