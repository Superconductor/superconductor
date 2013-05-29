#include "userFunctions.h"

int max(int a, int b){
	return a >= b ? a : b;
}
int sum(int a, int b){
	return a + b;
}
int calcWidth(bool shrink, int winput, int c1w, int c2w){
	if (shrink){
		return c1w + c2w;
	}
	else {
		return winput;
	}
}