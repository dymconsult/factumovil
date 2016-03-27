QString verhoeff(QString num, int times)
{
    int d[10][10] = {
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
    int p[8][10] = {
        {0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
        {1, 5, 7, 6, 2, 8, 3, 0, 9, 4},
        {5, 8, 0, 3, 7, 9, 6, 1, 4, 2},
        {8, 9, 1, 6, 0, 4, 3, 5, 2, 7},
        {9, 4, 5, 3, 1, 2, 6, 8, 7, 0},
        {4, 2, 8, 6, 5, 7, 3, 9, 0, 1},
        {2, 7, 9, 3, 8, 0, 6, 4, 1, 5},
        {7, 0, 4, 6, 9, 1, 3, 2, 5, 8}
    };
    int inv[] = {0, 4, 3, 2, 1, 5, 6, 7, 8, 9};
    for (;times > 0; times--) {
        int c = 0;
        for (int i = num.count()-1; i >= 0; i--){
            c = d[c][p[((num.count() - i) % 8)][num[i].digitValue()]];
        }
        num += QString::number(inv[c]);
    }
    return num;
}

QString arc4(QString msg, QString key)
{
    int state[256];
    for (int i=0; i<256; i++) {
        state[i] = i;
    }
    int j = 0, temp;
    for (int i=0; i<256; i++) {
        j = (j + state[i] + key[i % key.count()].unicode()) % 256;
        temp = state[i];
        state[i] = state[j];
        state[j] = temp;
    }
    int x = 0, y = 0;
    QString output = "";
    for (int i=0; i<msg.count(); i++) {
        x = (x + 1) % 256;
        y = (state[x] + y) % 256;
        temp = state[x];
        state[x] = state[y];
        state[y] = temp;
        output += QString("%1").arg(msg[i].unicode() ^ state[(state[x] + state[y]) % 256], 2, 16, QChar('0'));
    }
    return output.toUpper();
}

QString base64(int number) {
    QString result = "";
    QString dic = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
    while (number > 0) {
        result = dic[number % 64] + result;
        number = qFloor(number / 64);
    }
    return result;
}

QString controlCode(QString auth, QString number, QString nit, QString date, QString total, QString key) {
    QString code = "";
    number = verhoeff(number, 2);
    nit = verhoeff(nit, 2);
    date = verhoeff(date, 2);
    total = verhoeff(total, 2);
    QString vf = verhoeff(QString::number(
        number.toULongLong() +
        nit.toULongLong() +
        date.toULongLong() +
        total.toULongLong())
    , 5).right(5);

    QStringList input(QStringList() << auth << number << nit << date << total);
    int idx = 0;
    for (int i=0; i<5; i++) {
        code += input[i] + key.mid(idx, 1+vf[i].digitValue());
        idx += 1+vf[i].digitValue();
    }
    code = arc4(code, key + vf);

    int final_sum = 0;
    int total_sum = 0;
    int partial_sum[] = {0,0,0,0,0};
    for (int i=0; i<code.count(); i++) {
        partial_sum[i%5] += code[i].toLatin1();
        total_sum += code[i].toLatin1();
    }
    for (int i=0; i<5; i++) {
        final_sum += qFloor((total_sum * partial_sum[i]) / (1 + vf[i].digitValue()));
    }

    QStringList matched;
    QRegularExpressionMatchIterator regexp = QRegularExpression(".{2}").globalMatch(arc4(base64(final_sum), key + vf));
    while (regexp.hasNext()) matched << regexp.next().captured();
    code = matched.join("-");

    return code;
}