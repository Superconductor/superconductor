#!/bin/bash
### Compile generated kernel using OpenCLC (useful for static checks)
### Usage: run after normal Superconductor compiler, will automatically find files

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

TMP="$DIR/../../superconductorjs/tmp"
SRC="$DIR/../../superconductorjs/src"
KERNEL="$TMP/kernels.cl"

FILE=`mktemp $TMP/tmp.cl.XXXXXXX`

CC="/System/Library/Frameworks/OpenCL.framework/Libraries/openclc"
CFLAGS="-x cl -cl-std=CL1.2 -cl-auto-vectorize-enable -emit-gcl"

echo "============ compiling $KERNEL ==============="

cat $SRC/drawing2.cl $SRC/common.h >> $FILE
cat $TMP/cl_runner_generated_buffer_info.h >> $FILE
cat $KERNEL >> $FILE

$CC $CFLAGS $FILE

rm $FILE
