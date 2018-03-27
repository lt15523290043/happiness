//二维数组来存储交叉点落子情况
var chessBoard=[];
var me=true;
var over=false;
//赢法数组(三维)
var wins=[];
//赢法的统计数组
var mywin=[];
var computerwin=[];
//二维数组来存储交叉点落子情况
for(var i=0;i<15;i++)
{
	chessBoard[i]=[];
	for(var j=0;j<15;j++)
	{
		//初始化，0代表未落子为空
		chessBoard[i][j]=0;
	}
}
//三维数组
for(var i=0;i<15;i++)
{
	wins[i]=[];
	for(var j=0;j<15;j++)
	{
		wins[i][j]=[];
	}
}
//赢法种类的索引
var count=0;
//横线
for(var i=0;i<15;i++)
{
	for(var j=0;j<11;j++){
		//wins[0][0][0]=true;
		//wins[0][1][0]=true;
		//wins[0][2][0]=true;
		//wins[0][3][0]=true;
		//wins[0][4][0]=true;
		for(var k=0;k<5;k++)
		{
			wins[i][j+k][count]=true;
		}
		count++;
	}
}

//竖线
for(var i=0;i<15;i++)
{
	for(var j=0;j<11;j++)
	{
		for(var k=0;k<5;k++)
		{
			wins[j+k][i][count]=true;
		}
		count++;
	}
}
//斜线
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}
//反斜线
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}
console.log(count);
//初始化赢法统计数组
for(var i=0;i<count;i++)
{
	mywin[i]=0;
	computerwin[i]=0;
}
var chess=document.getElementById('chess');
var context=chess.getContext('2d');
context.strokeStyle="BFBFBF";
var icon=new Image();
icon.src="icon.png";
icon.onload=function()
{
	//绘制北背景图
	context.drawImage(icon,0,0,450,450);
       //绘制五子棋棋盘
	drawChessBoard();
}
//画棋盘
var drawChessBoard=function()
{
	for(var i=0;i<15;i++)
{
        context.moveTo(15+i*30,15);//画横线，垂直坐标不变
        context.lineTo(15+i*30,435);
        context.stroke();
        context.moveTo(15,15+i*30);//画竖线，横坐标不变
        context.lineTo(435,15+i*30);
        context.stroke();//stroke是用来描边的
       }
}
var oneStep=function(i,j,me)
{
 	 //绘制棋子
       context.beginPath();
       context.arc(15+i*30,15+j*30,13,0,2*Math.PI); //圆心坐标，半径，弧度
       context.closePath();
       //实现渐变
      var gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
       if(me)
       {
                 gradient.addColorStop(0,"#0A0A0A");
                 gradient.addColorStop(1,"#636766");}
	 else 
	 {
		 gradient.addColorStop(0,"#D1D1D1");
                 gradient.addColorStop(1,"#f9f9f9");
	 }
         context.fillStyle=gradient;
	 //fill是用来填充
	 context.fill();
 }
  //落子
chess.onclick=function(e)
{
	if(over)
	{
		return;
	}
	//onclick只有在我方下棋时才有效
	if(!me){return;
	       }
	var x=e.offsetX;
	var y=e.offsetY;
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBoard[i][j]==0)
	{
		oneStep(i,j,me);
		chessBoard[i][j]=1;
		for(var k=0;k<count;k++)
		{
			if(wins[i][j][k])
			{
				//若存在一个K，使得myWin【k】=5,说明第k种赢法被实现
				mywin[k]++;
				//6为异常情况，表示不可能赢
				computerwin[k]=6;
				if(mywin[k]==5)
				{
					window.alert("你赢了");
					 over=true;
				}
			}
		}
		//若没结束，下棋权利给计算机
		if(!over)
		{
			me=!me;
			computerAI();
		}
	}	
}
var computerAI=function()
{
	var myScore=[];
        var computerScore=[]
        //保存最高分数
        var max=0;
        var u=0,v=0;
	for(var i=0;i<15;i++)
	{
		myScore[i]=[];
  	        computerScore[i]=[];
		for(var j=0;j<15;j++)
		{
			myScore[i][j]=0;
  		        computerScore[i][j]=0;
		}
	}
	for(var i=0;i<15;i++)
	{
		for(var j=0;j<15;j++)
		{
			if(chessBoard[i][j]==0)
			{
				for(var k=0;k<count;k++)
				{
					if(wins[i][j][k])
					{
						if(mywin[k]==1)
						{
							myScore[i][j]+=200;
						}
						else if(mywin[k]==2)
						{
							myScore[i][j]+=400;
						}
						else if(mywin[k]==3)
						{
							myScore[i][j]+=2000;
						}
						else if(mywin[k]==4)
						{
  						        myScore[i][j]+=10000;
						}
					       if(computerwin[k]==1)
					       {
						       computerScore[i][j]+=220;
					       }
						else if(computerwin[k]==2)
						{
							computerScore[i][j]+=420;
						}
						else if(computerwin[k]==3)
						{
							computerScore[i][j]+=2100;
						}
						else if(computerwin[k]==4)
						{
							computerScore[i][j]+=20000;
						}
					}
				}
				if(myScore[i][j]>max)
				{
					max=myScore[i][j];
					u=i;
					v=j;
				}
  			else if(myScore[i][j]==max)
			{
  				if(computerScore[i][j]>computerScore[u][v])
				{
  					u=i;
  					v=j;
  				}
  			}
  			if(computerScore[i][j]>max)
			{
  				max=computerScore[i][j];
  				u=i;
  				v=j;
			}
				else if(computerScore[i][j]==max)
				{
					if(myScore[i][j]>myScore[u][v])
					{
						u=i;
						v=j;
					}
				}
			}
		}
	}
	oneStep(u,v,false);
	//计算机落子
	chessBoard[u][v]=2;
	for(var k=0;k<count;k++)
	{
		if(wins[u][v][k])
		{
			computerwin[k]++;
			mywin[k]=6;
			if(computerwin[k]==5)
			{
				window.alert("计算机赢了");
				over=true;
			}
		}
	}
	if(!over)
	{
		me=!me;
	}
}
			
	
