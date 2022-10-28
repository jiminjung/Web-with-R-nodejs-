

args = (commandArgs(TRUE))

if(length(args)==0){
  print("No arguments supplied.")
}else{
  for(i in 1:length(args)){
     eval(parse(text = args[[i]]))
  }
}

setwd("C:\\Users\\jimin\\vscode-workspace\\Web_with_R\\userGraph")
wdFormat <- ".\\%s"
wd <- sprintf(wdFormat,ip)
dir.create(wd)
setwd(wd)

chart_data <- c(a, b, c, d)

names(chart_data) <- c("A","B","C","D")

png(filename="myplot.jpg",width=300,height=600,unit="px",bg="transparent")
barplot(chart_data, col = rainbow(4), main = "Bar Plot in Web")
dev.off()




