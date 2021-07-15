// Databricks notebook source
// Q2 [25 pts]: Analyzing a Large Graph with Spark/Scala on Databricks

// STARTER CODE - DO NOT EDIT THIS CELL
import org.apache.spark.sql.functions.desc
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types._
import spark.implicits._

// COMMAND ----------

// STARTER CODE - DO NOT EDIT THIS CELL
// Definfing the data schema
val customSchema = StructType(Array(StructField("answerer", IntegerType, true), StructField("questioner", IntegerType, true),
    StructField("timestamp", LongType, true)))

// COMMAND ----------

// STARTER CODE - YOU CAN LOAD ANY FILE WITH A SIMILAR SYNTAX.
// MAKE SURE THAT YOU REPLACE THE examplegraph.csv WITH THE mathoverflow.csv FILE BEFORE SUBMISSION.
val df = spark.read
   .format("com.databricks.spark.csv")
   .option("header", "false") // Use first line of all files as header
   .option("nullValue", "null")
   .schema(customSchema)
   .load("/FileStore/tables/mathoverflow.csv")
   .withColumn("date", from_unixtime($"timestamp"))
   .drop($"timestamp")

// COMMAND ----------

//display(df)
df.show()

// COMMAND ----------

// PART 1: Remove the pairs where the questioner and the answerer are the same person.
// ALL THE SUBSEQUENT OPERATIONS MUST BE PERFORMED ON THIS FILTERED DATA

// ENTER THE CODE BELOW
val df2 = df.filter("answerer!=questioner")
df2.show()

// COMMAND ----------

// PART 2: The top-3 individuals who answered the most number of questions - sorted in descending order - if tie, the one with lower node-id gets listed first : the nodes with the highest out-degrees.

// ENTER THE CODE BELOW
// df2.agg(count(df2("answerer")),max(df2("questioner"))).show()
// df2.groupBy("answerer").agg(count(df2("answerer"))).orderBy(desc("count(answerer)"),asc("answerer")).show(3)
df2.groupBy("answerer").agg(expr("count(*) as questions_answered")).orderBy(desc("questions_answered"),asc("answerer")).show(3)

// COMMAND ----------

// PART 3: The top-3 individuals who asked the most number of questions - sorted in descending order - if tie, the one with lower node-id gets listed first : the nodes with the highest in-degree.

// ENTER THE CODE BELOW

df2.groupBy("questioner").agg(expr("count(*) as questions_asked")).orderBy(desc("questions_asked"),asc("questioner")).show(3)

// COMMAND ----------

// PART 4: The top-5 most common asker-answerer pairs - sorted in descending order - if tie, the one with lower value node-id in the first column (u->v edge, u value) gets listed first.

// ENTER THE CODE BELOW
df2.groupBy("answerer","questioner").agg(expr("count(*) as count")).orderBy(desc("count"),asc("answerer"),asc("questioner")).show(5)

// COMMAND ----------

// PART 5: Number of interactions (questions asked/answered) over the months of September-2010 to December-2010 (i.e. from September 1, 2010 to December 31, 2010). List the entries by month from September to December.

// Reference: https://www.obstkel.com/blog/spark-sql-date-functions
// Read in the data and extract the month and year from the date column.
// Hint: Check how we extracted the date from the timestamp.

// ENTER THE CODE BELOW
val df3 = df2.withColumn("date",to_date(unix_timestamp(df2.col("date"), "yyyy-MM-dd HH:mm:ss").cast("timestamp")))
// val df4 = df3.withColumn("month", date_format(to_date($"date", "yyyy-MM-dd"), "M"))
val df4 = df3.withColumn("month", month($"date"))
val df5 = df4.withColumn("year", year($"date"))
val df6 = df5.filter("year==2010")
df6.groupBy("month").agg(expr("count(*) as total_interactions")).orderBy("month").filter("month>8").show()

// COMMAND ----------

// PART 6: List the top-3 individuals with the maximum overall activity, i.e. total questions asked and questions answered.

// ENTER THE CODE BELOW
// df3.select(df3("answerer")).union(df3.select(df3("questioner"))).count()
val df4 = df3.select(df3("answerer")).union(df3.select(df3("questioner")))
df4.groupBy("answerer").agg(expr("count(*) as total_activity")).select($"answerer".alias("userID"), $"total_activity").orderBy(desc("total_activity"),asc("userID")).show(3)

// COMMAND ----------


