const fs = require('fs');
const mysql = require('mysql2/promise');
const config = require('../config');
class Test {
    getFile(fileName)
    {
        const file = fs.readFileSync(fileName, 'utf8');
        // console.log(file[0]);
        return file;
        
    }

    
    checkFile(fileName)
    {   

        const fileArr = new Test().getFile(fileName).split('\n');
        let newArr = [];
        let text = '';
        // const 
        //     regNumDots = /^\d{1,5}\./,
        //     regNumDotsSpace = /^\d{1,5}\s\./,
        //     regNumBrackets = /^\d{1,5}\)/,
        //     regNumBracketsSpace = /^\d{1,5}\s\)/,
        //     regWordDotsRus = /^[А-Яа-я]{1}\./,
        //     regWordDotsRusSpace = /^[А-Яа-я]{1}\s\./,
        //     regWordBracketsRus = /^[А-Яа-я]{1}\)/,
        //     regWordBracketsRusSpace = /^[А-Яа-я]{1}\s\./,
        //     regWordDotsEng = /^\w{1}\./,
        //     regWordDotsEngSpace = /^\w{1}\s\./,
        //     regWordBracketsEng = /^\w{1}\)/,
        //     regWordBracketsEngSpace = /^\w{1}\s\)/;
        const 
            regNumDots = /^\d{1,5}\./,
            regNumDotsSpace = /^\d{1,5}\s\./,
            regNumBrackets = /^\d{1,5}\)/,
            regNumBracketsSpace = /^\d{1,5}\s\)/,
            regWordDotsRus = /^[А-Яа-я]{1}\./,
            regWordDotsRusSpace = /^[А-Яа-я]{1}\s\./,
            regWordBracketsRus = /^[А-Яа-я]{1}\)/,
            regWordBracketsRusSpace = /^[А-Яа-я]{1}\s\./,
            regWordDotsEng = /^\w{1}\./,
            regWordDotsEngSpace = /^\w{1}\s\./,
            regWordBracketsEng = /^\w{1}\)/,
            regWordBracketsEngSpace = /^\w{1}\s\)/,
            regNumWithouDots = /^\d{1,5}/;

        for(let i = 0; i < fileArr.length; i++)
        {
            fileArr[i] =  fileArr[i].trim();
            if(fileArr[i] != '\n' && fileArr[i] != '')
            {
                if (
                    !fileArr[i].match(regNumDots) &&
                    !fileArr[i].match(regNumDotsSpace) &&
                    !fileArr[i].match(regNumBrackets) &&
                    !fileArr[i].match(regNumBracketsSpace) &&
                    !fileArr[i].match(regWordDotsRus) &&
                    !fileArr[i].match(regWordDotsRusSpace) &&
                    !fileArr[i].match(regWordBracketsRus) &&
                    !fileArr[i].match(regWordBracketsRusSpace) &&
                    !fileArr[i].match(regWordDotsEng) &&
                    !fileArr[i].match(regWordDotsEngSpace) &&
                    !fileArr[i].match(regWordBracketsEng) &&
                    !fileArr[i].match(regWordBracketsEngSpace) &&
                    !fileArr[i].match(regNumWithouDots) 
                )
                {
                    newArr[newArr.length - 1] += `\n ${fileArr[i]}`
                }
                else 
                {   
                    fileArr[i] = fileArr[i].replace(regNumDots, '');
                    fileArr[i] = fileArr[i].replace(regNumDotsSpace, '');
                    fileArr[i] = fileArr[i].replace(regNumBrackets, '');
                    fileArr[i] = fileArr[i].replace(regNumBracketsSpace, '');
                    fileArr[i] = fileArr[i].replace(regWordDotsRus, '');
                    fileArr[i] = fileArr[i].replace(regWordDotsRusSpace, '');
                    fileArr[i] = fileArr[i].replace(regWordBracketsRus, '');
                    fileArr[i] = fileArr[i].replace(regWordBracketsRusSpace, '');
                    fileArr[i] = fileArr[i].replace(regWordDotsEng, '');
                    fileArr[i] = fileArr[i].replace(regWordDotsEngSpace, '');
                    fileArr[i] = fileArr[i].replace(regWordBracketsEng, '');
                    fileArr[i] = fileArr[i].replace(regWordBracketsEngSpace, '');
                    newArr.push(fileArr[i])
                }
            }

        }

        return newArr;

    }
    

    getTestArr(checkedTest, count)
    {
        let 
            testArr = [],
            obj = {},
            ansArr = [];

        for (let i = 0; i < checkedTest.length; i++)
        {
            if ( (i + 1) % count === 0)
            {
                ansArr.push(checkedTest[i]);
                obj.answers = ansArr;
                testArr.push(obj);
                ansArr = [];
                obj = [];

            } else 
            {
                if( ( i + 1 ) % count == 1)
                {
                    obj.question = checkedTest[i];
                } else 
                {
                    ansArr.push(checkedTest[i]);
                   
                }
            }
        }
        
        return testArr;

    }

    //Случайное число
    getRandomNum(max)
    {
        return Math.floor(Math.random() * Math.floor(max));
    }

    getRandomArr(testArr)
    {
        
        let randomArr = [];
 
       
        if(testArr.length >= 40)
        {
            for(let i = 0; i < 40;)
            {
                let tempNum = new Test().getRandomNum(testArr.length);
                if(randomArr.indexOf(tempNum) == -1)
                {
                    randomArr.push(tempNum);
                    i++;
                }
            }
           
        }
        else 
        {
            for(let i = 0; i < testArr.length;)
            {
                let tempNum = new Test().getRandomNum(testArr.length);
                if(randomArr.indexOf(tempNum) == -1)
                {
                    randomArr.push(tempNum);
                    i++;
                }
            }
        }
       
        return randomArr;
    }
    

    getRemains(mainNum, num)
    {
        let tempVar = 0;
        let remains = 0;
        let tempArr = [];

        if(mainNum > num)
        {
            tempVar = Math.floor(mainNum / num);
            remains = mainNum - (tempVar * num);
        }
        for(let i = 0; i < tempVar; i++)
        {
            tempArr.push(num)
        }

        if(remains)
        {
            tempArr.push(remains);
        }

        return(tempArr);

    }

    getCycleArr(cycleCount, testsArr)
    {
        let cycleArr = new Test().getRemains(testsArr.length, 40);
        let tempCycle = [];
        

        
        // for( let i = 0; i <  cycleArr[cycleCount]; i++)
        // {
        //     if(cycleCount == 0)
        //     {
        //         tempCycle.push(i);
        //     }
        //     else 
        //     {
        //         let formula = i + (cycleArr[cycleCount] * cycleCount);
        //         console.log(cycleCount)
        //         tempCycle.push( formula )
        //     }

        // }
        for( let i = 0; i <  cycleArr[cycleCount]; i++)
        {
            if(cycleCount == 0)
            {
                tempCycle.push(i);
            }
            else 
            {
                if(cycleArr[cycleCount] < 40)
                {
                    let formula = i + (40 *cycleCount);
                  
                    tempCycle.push( formula )
                } else 
                {
                    let formula = i + (cycleArr[cycleCount] * cycleCount);
                    
                    tempCycle.push( formula )
                }
           
            }

        }
        
 
        return tempCycle;
        
    }


    checkTest(data, testArr)
    {
        let answersData = [];
        let tempObj = {};
        let count = 0;
        let dataNew = data;
        delete dataNew.cycle;
        for ( let item in dataNew)
        {
            // console.log(item)
            if (count == 1)
            {
                tempObj.answer = dataNew[item];
                tempObj.check = false;
                answersData.push(tempObj);
                
                tempObj = {};
                count = 0;


            }
            else 
            {
                tempObj.question = dataNew[item];
                count++;

            }
    
        }

        for( let a = 0; a < answersData.length; a++)
        {
            let q = +answersData[a].question;
            let ans = answersData[a].answer;
            // console.log(answersData[0])
            // console.log(testArr)
            answersData[a].rightAnswer = testArr[q].answers[0];
            
            if(testArr[q].answers.indexOf(ans) != -1)
            {   
                answersData[a].question  = testArr[q].question;
                if(testArr[q].answers[0] == ans)
                {   
                    answersData[a].check = true;
                }
            } else
            {
         
                return answersData = 'Вы ответили не на все вопросы!';
            }

        }



        return(answersData);
    }



    async getUserTests(userId)
    {
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.execute(`SELECT * FROM tests WHERE userId="${userId}"`);
        connection.end();
        return rows;
    }

    async removeTest(testId)
    {
        const connection = await mysql.createConnection(config);
        await connection.execute(`DELETE FROM tests WHERE id="${testId}" LIMIT 1`);
        connection.end();
    }

    async getTest(testId)
    {
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.execute(`SELECT * FROM tests WHERE id="${testId}" LIMIT 1`);
        connection.end();
        const test = rows[0];
        
        return test;
    }

    async updateCycle(testId, cycle, testArr)
    {
        let cycleArr = new Test().getRemains(testArr.length, 40);
        const connection = await mysql.createConnection(config);
        if(cycle == (cycleArr.length - 1) || cycle >= (cycleArr.length - 1))
        {
            await connection.execute(`UPDATE tests SET cycle="0" WHERE id="${testId}" `);
        }
        else 
        {
            await connection.execute(`UPDATE tests SET cycle="${cycle+1}" WHERE id="${testId}" `);
        }
        
        
        connection.end();

    }

    async resetCycle(testId)
    {
        const connection = await mysql.createConnection(config);
        await connection.execute(`UPDATE tests SET cycle="0" WHERE id="${testId}" LIMIT 1`)
        connection.end();
    }

    async addProgress(userId, test, result)
    {

        const connection = await mysql.createConnection(config);
        await connection.execute(`INSERT INTO results SET userId="${userId}", test_name="${test.name}", result="${result}"`);
        connection.end();
    }
    
    async getProgress(userId)
    {   
        
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.execute(`SELECT * FROM results WHERE userId="${userId}"`);
        connection.end();

        return rows;
    }

    
}

module.exports = Test;