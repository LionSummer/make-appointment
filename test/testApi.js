var Main = require("../main.js");
var assert  = require("assert");

it("test getOptionals Api", function()
{
    let runData = Main.getOptionals('2020-02-5');
    //console.log('====> runData = ', runData)

    //assert.equal(runData, );
    //assert.equal(runData[0].isSelect, false);
});

it("test selectOptional Api", function()
{
    let runData = Main.selectOptional('2020-2-12', 10, ['12102','12105']);
    console.log('=selectOptional=> runData = ', runData, Main.messageData[runData])

    //assert.equal(runData, );
    assert.equal(runData, 200);
});

 
// 当第2个参数为String时
/*it("should return undefined", function()
{
    var sum = add(1, "2");
    assert.equal(sum, undefined);
});*/