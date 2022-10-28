
args = (commandArgs(TRUE))

if(length(args)==0){
  print("No arguments supplied.")
}else{
  for(i in 1:length(args)){
    eval(parse(text = args[[i]]))
  }
}

setwd("C:\\Users\\selab\\vscode-workspace\\Web_with_R\\userFile")
wdFormat <- ".\\%s"
wd <- sprintf(wdFormat,ip)
setwd(wd)

userfile <- paste0(userfilename,".csv")

csv_data <- read.csv(userfile, header = TRUE)

setwd("C:\\Users\\selab\\vscode-workspace\\Web_with_R\\userGraph")
wdFormat2 <- ".\\%s"
wd <- sprintf(wdFormat2,ip)
dir.create(wd)
setwd(wd)

names(csv_data)[4] <- c("광량")
csv_data$co2 <- as.numeric(gsub(",","",csv_data$co2))

csv_data$수집시간 <- sub("T ","",csv_data$수집시간)
csv_data$수집시간 <- as.POSIXct(csv_data$수집시간, format = "%Y-%m-%d %H:%M")
head(csv_data$수집시간)

#install.packages("ggplot2")
library(ggplot2)
library(dplyr)

#온도
a <- csv_data%>%
      ggplot(aes(수집시간, 온도, group=1))+ 
      geom_line(color = 'coral')+
      ggtitle("Temperature")+
      xlab("Time") + ylab("Temperature")+
      theme_light()+
      theme(plot.title = element_text(size=20, hjust = 0.5))
ggsave(filename = "Temperature.png", plot = a, width = 12, height = 6)


#습도
b <- csv_data%>%
  ggplot(aes(수집시간, 습도, group=1))+ 
  geom_line(color = 'cyan')+
  ggtitle("Humidity")+
  xlab("Time") + ylab("Humidity")+
  theme_light()+
  theme(plot.title = element_text(size=20, hjust = 0.5))
ggsave(filename = "Humidity.png", plot = b, width = 12, height = 6)

#조도
c <- csv_data%>%
  ggplot(aes(수집시간, 광량, group=1))+ 
  geom_line(color = 'yellow')+
  ggtitle("Illumination")+
  xlab("Time") + ylab("Illumination")+
  theme_light()+
  theme(plot.title = element_text(size=20, hjust = 0.5))
ggsave(filename = "Illumination.png", plot = c, width = 12, height = 6)

#co2
d <- csv_data%>%
  ggplot(aes(수집시간, co2, group=1))+ 
  geom_line(color = 'darkviolet')+
  ggtitle("CO2")+
  xlab("Time") + ylab("CO2")+
  theme_light()+
  theme(plot.title = element_text(size=20, hjust = 0.5))
ggsave(filename = "CO2.png", plot = d, width = 12, height = 6)

#vpd
e <- csv_data%>%
  ggplot(aes(수집시간, vpd, group=1))+ 
  geom_line(color = 'springgreen')+
  ggtitle("Vapor Pressure Deficit")+
  xlab("Time") + ylab("vpd")+
  annotate("rect",xmin=csv_data$수집시간[1], xmax=csv_data$수집시간[length(csv_data$수집시간)] , ymin=0.5, ymax=1.2, alpha=0.2, fill="red")+
  theme_light()+
  theme(plot.title = element_text(size=20, hjust = 0.5))
ggsave(filename = "VPD.png", plot = e, width = 12, height = 6)

#함수율
if(names(csv_data)[11]=="함수율" || names(csv_data)[10]=="함수율" ){
  csv_data <- subset(csv_data, 함수율>67 & 함수율<73)
  f <- csv_data%>%
    ggplot(aes(수집시간, 함수율, group=1))+ 
    geom_line(color = 'dodgerblue')+
    ggtitle("Moisture Content")+
    xlab("Time") + ylab("Moisture content")+
    theme_light()+
    theme(plot.title = element_text(size=20, hjust = 0.5))
  ggsave(filename = "Moisture content.png", plot = f, width = 12, height = 6)
}else{
  print("No Moisture content")
}
