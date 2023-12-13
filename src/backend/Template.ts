/*
  MIT License

  Copyright © 2023 Alex Høffner

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software
  and associated documentation files (the “Software”), to deal in the Software without
  restriction, including without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or
  substantial portions of the Software.

  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
  BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


import { FormsModule } from "../FormsModule";
import { BindValue, DataType, ParameterType, SQLStatement, StoredProcedure } from "futureforms";

export class Template
{
	public static async execSomeSQL(arg1:string) : Promise<string>
	{
		let row:any[] = null;
		let stmt:SQLStatement = new SQLStatement(FormsModule.DATABASE);

		stmt.sql =
		`
			select column1
			from table
			where column0 = :arg1
		`;

		stmt.addBindValue(new BindValue("arg1",arg1,DataType.string));

		let success:boolean = await stmt.execute();
		if (success) row = await stmt.fetch();

		if (row)	return(row[0]);
		return(null);
	}


	public static async procWithInOut(arg1:string) : Promise<number[]>
	{
		let out:number[] = [0,0];
		let func:StoredProcedure = new StoredProcedure(FormsModule.DATABASE);

		func.setName("funcWithInOut");

		func.addParameter("arg1",arg1,DataType.varchar);
		func.addParameter("out1",0,DataType.integer,ParameterType.inout);
		func.addParameter("out2",0,DataType.integer,ParameterType.inout);

		let success:boolean = await func.execute();

		if (success)
		{
			out[0] = func.getOutParameter("out1");
			out[1] = func.getOutParameter("out2");
		}

		return(out);
	}
}