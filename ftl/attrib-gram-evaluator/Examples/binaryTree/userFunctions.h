#include <cstdio>
#include <stdlib.h>
#include <iostream> 

int max(int a, int b);
int sum(int a, int b);
int sub(int a, int b);
int bin_split(int w, int leftFringeSize, int fringeSize);
int bin_subtreeh(int leftst, int leftoff, int rightst, int rightoff, int hstep, int h);
int bin_tobot(int bottomY, int hstep, int lefth, int righth);
int bin_center(int x, int w);
