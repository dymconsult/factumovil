#!/usr/bin/python

import sys
import getopt
import literal


def main(argv):
	number = ''
	try:
		opts, args = getopt.getopt(argv, 'hn:', ['number='])
	except getopt.GetoptError:
		print('literal_cli.py -n <number>')
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print('literal_cli.py -n <number>')
			sys.exit()
		elif opt in ("-n", "--number"):
			number = arg

	print(literal.toLiteral(number))

if __name__ == "__main__":
	main(sys.argv[1:])
