//cette fonction va etre lance lorsque la fenetre va etre afficher
//Canves : est un élement de HTML5 qui nous permet de dessiner sur notre page html
window.onload = function()
{

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30; //chaque bloc est mesurer 30px sur 30px
    var x;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var HeightInBlocks = canvasHeight/blockSize;
    var score;
    var timeOut;



 init();

    function init()
    {
         //on va crée un doc de type canvas sur la page HTML
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        //Style canvas ==> CSS 
        canvas.style.border = "10px solid red";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        //reférence de la balise body (tous les contenues de cette balise)
        document.body.appendChild(canvas);
    
        x = canvas.getContext('2d');
        snakee = new snake([[6,4], [5,4]], "right");
        applee = new apple([10,10]);
        score = 0;
        refreshCanvas();
    }



    function refreshCanvas()
    {
        snakee.advance();
        if(snakee.checkCollision())
        {
            gameOver();
        }
        // * else if(score == 5)
        // *{
        //     *uWin(); 
        // *}
        else
        {
            if(snakee.eatApple(applee))
            {
                score++;
                snakee.ateApple = true;
                do
                {
                applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee));
            }
            x.clearRect(0,0,canvasWidth, canvasHeight);
            snakee.draw();
            applee.draw();
            drawScore();
            timeOut = setTimeout(refreshCanvas, delay);
        }
    
    }
    
    function gameOver()
    {
        x.save();
       // alert("Game Over! Press the space key to replay");
         x.font = "bold 50px sans-serif";
         x.fillStyle = "#000";
         x.textAlign = "center";
         var centreX = canvasWidth / 2;
         var centreY = canvasHeight / 2;
         x.fillText("Game Over!", centreX, centreY - 180);
         x.fillText("press the space key to replay", centreX, centreY - 120);
        x.restore();
    }

    function uWin(){
        x.save();
        x.font = "bold 50px sans-serif";
        x.fillStyle = "#000";
        x.textAlign = "center";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        x.fillText("You win!", centreX, centreY - 180);
        x.fillText("press the space key to play again!", centreX, centreY - 120);
        x.restore();
    }

    function restart()
    {
        snakee = new snake([[6,4], [5,4]], "right");
        applee = new apple([10,10]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }

    function drawScore()
    {
        x.save();
        x.font = "bold 40px sans-serif";
        x.fillText(score.toString(), 5, canvasHeight - 5);
        x.restore();
    }

    function drawBlock(x, position)
    {
        var a = position[0] * blockSize; //position[0] ==> x
        var b = position[1] * blockSize; //position[1] ==> y
        x.fillRect(a , b , blockSize , blockSize)
    }

    function snake(body, direction)
    {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function() //cette méthode va nous aider de dessiner le corps de notre serpant
        {
                x.save(); //sauvegarder le contenu
                x.fillStyle = "#000000";
                for(var i = 0; i < this.body.length; i++)
                {
                    drawBlock(x, this.body[i]);
                }
                x.restore();
        };

        this.advance = function()
        {
            var nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "left":
                    nextPosition[0]--;
                    break;
                case "right":
                    nextPosition[0]++;
                    break;
                case "down":
                    nextPosition[1]++;
                    break;
                case "up":
                    nextPosition[1]--;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };

        this.setDirection = function(newDirection)
        {
            var allowedDirections;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirections = ["up" , "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left" , "right"];
                    break;
                default:
                    throw("Invalid Direction");
          
          
                }

                if(allowedDirections.indexOf(newDirection) > -1)
        {
            this.direction = newDirection;
        }
        };
        

       this.checkCollision = function()
       {
        var wallCollision = false;
        var snakeCollision = false;
        var head = this.body[0];
        var rest = this.body.slice(1);
        var snakeX = head[0];
        var snakeY = head[1];
        var minX = 0;
        var minY = 0;
        var maxX = widthInBlocks - 1;
        var maxY = HeightInBlocks - 1;
        var INBhW = snakeX < minX || snakeX > maxX; 
        var INBvW = snakeY < minY || snakeY > maxY; 

        if (INBhW || INBvW) 
        {
            wallCollision = true;
        }

        for(var i = 0; i < rest.length; i++)
        {
            if(snakeX === rest[i][0] && snakeY === rest[i][1])
            {
                snakeCollision = true;
            }
        }

        return wallCollision || snakeCollision;
       };
       this.eatApple = function(ate)
       {
        var head = this.body[0];
        if(head[0] === ate.position[0] && head[1] === ate.position[1])
        
            return true;
        
        else
        
            return false;
        
       };


    }

function apple(position)
{
    this.position = position;
    this.draw = function()
    {
        x.save();
        x.fillStyle = "#F91111";
        x.beginPath();
        var radius = blockSize/2;
        var x2 = this.position[0]*blockSize + radius;
        var y = this.position[1]*blockSize + radius;
        x.arc(x2, y, radius, 0, Math.PI*2, true);
        x.fill();
        x.restore();
    };
    this.setNewPosition = function()
    {
        var newX = Math.round(Math.random() * (widthInBlocks - 1));
        var newY = Math.round(Math.random() * (HeightInBlocks - 1));
        this.position = [newX, newY];
    }
    this.isOnSnake = function(checkSnake)
    {
        var isOnSnake = false;
        for(var i = 0 ; i < checkSnake.body.length; i++)
        {
            //isOnSnake = true;
            if(this.position[0] === checkSnake.body[i][0] && this.position[1] === checkSnake.body[i][1])
            {
                isOnSnake = true;
            }
        }
        return isOnSnake;
    };
}



    document.onkeydown = function handleKeyDown(e)          //lorsque l'utilisateur appui sur une touche de son clavier
    {
        var key = e.keyCode;
        var newDirection;
        switch(key) //selon la touche que vous avez appuyer
        { //code des 4 fléches 37, 38, 39, 40
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }


}
