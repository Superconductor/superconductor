#prepare the DVI file:

latex  -interaction=nonstopmode "\input" main.tex
bibtex main
latex  -interaction=nonstopmode "\input" main.tex
latex  -interaction=nonstopmode "\input" main.tex

#render the high resolution PDF from the DVI file:
MYBOOKDVI=main.dvi
MYBOOKPDF=main_highres.pdf

DVIPS="dvips -j0 -Pcmz -Ppdf -Pdownload35 -G0 -t letter -D 1200 -Z -mode ljfzzz"

${DVIPS} ${MYBOOKDVI} -o - | gs -q -dNOPAUSE -dBATCH \
	-sDEVICE=pdfwrite -dPDFSETTINGS=/prepress\
	-dCompatibilityLevel=1.3 \
	-dCompressPages=true -dUseFlateCompression=false \
	-sPAPERSIZE=letter \
	-dSubsetFonts=true -dEmbedAllFonts=true \
	-dProcessColorModel=/DeviceGray \
	-dDetectBlends=true -dOptimize=true \
	-dDownsampleColorImages=true -dColorImageResolution=1200 \
	-dColorImageDownsampleType=/Average -dColorImageFilter=/FlateEncode \
	-dAutoFilterColorImages=false -dAntiAliasColorImages=false \
	-dColorImageDownsampleThreshold=1.50000 \
	-dDownsampleGrayImages=true -dGrayImageResolution=1200 \
	-dGrayImageDownsampleType=/Average -dGrayImageFilter=/FlateEncode \
	-dAutoFilterGrayImages=false -dAntiAliasGrayImages=false \
	-dGrayImageDownsampleThreshold=1.50000 \
	-dDownsampleMonoImages=true -dMonoImageResolution=1200 \
	-dMonoImageDownsampleType=/Average -dMonoImageFilter=/FlateEncode \
	-dAutoFilterMonoImages=false -dAntiAliasMonoImages=false \
	-dMonoImageDownsampleThreshold=1.50000 \
	-sOutputFile=${MYBOOKPDF} \
	-c save pop -

