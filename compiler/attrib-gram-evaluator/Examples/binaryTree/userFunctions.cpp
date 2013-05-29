#include "userFunctions.h"

int max(int a, int b){
	return a >= b ? a : b;
}
int sum(int a, int b){
	return a + b;
}
int sub(int a, int b){
    return a - b;
}
int bin_split(int w, int leftFringeSize, int fringeSize){
    return w * leftFringeSize/fringeSize;
}
int bin_subtreeh(int leftst, int leftoff, int rightst, int rightoff, int hstep, int h){
    return (hstep + h + max(leftst + leftoff, rightst + rightoff));
}
int bin_tobot(int bottomY, int hstep, int lefth, int righth){
    return bottomY + hstep + max(lefth, righth);
}
int bin_center(int x, int w){
    return x + w/2;
}
