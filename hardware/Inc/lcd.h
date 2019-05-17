#ifndef lcd_H
#define lcd_H

void lcdwrite(int inp,char ins);
void lcdwritestring(char* vec, char pos);
void lcdsetpos(char pos);
void lcdclr(void);
void initDispl();
void showTask(void);
char altletters(char x, int inp);
#endif