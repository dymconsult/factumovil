#!/usr/bin/python

import sys
import getopt
import cc

def main(argv):
	auth = ''
	invoice = ''
	nit = ''
	date = ''
	total = ''
	key = ''
	try:
		opts, args = getopt.getopt(argv, "ha:i:n:d:t:k:", ["auth=", "invoice=", "nit=", "date=", "total=", "key="])
	except getopt.GetoptError:
		print('cc_cli.py -a <auth> -i <invoice> -n <nit> -d <date> -t <total> -k <key>')
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print('cc_cli.py -a <auth> -i <invoice> -n <nit> -d <date> -t <total> -k <key>')
			sys.exit()
		elif opt in ("-a", "--auth"):
			auth = arg
		elif opt in ("-i", "--invoice"):
			invoice = arg
		elif opt in ("-n", "--nit"):
			nit = arg
		elif opt in ("-d", "--date"):
			date = arg
		elif opt in ("-t", "--total"):
			total = arg
		elif opt in ("-k", "--key"):
			key = arg

	print(cc.controlCode(auth, invoice, nit, date, total, key))

if __name__ == "__main__":
	main(sys.argv[1:])
