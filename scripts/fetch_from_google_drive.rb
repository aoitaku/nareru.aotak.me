require 'pathname'
require 'google_drive'
require 'oj'
file = (Pathname(__dir__) / "../public/data/tweets").to_s
session = GoogleDrive::Session.from_config((Pathname(__dir__) / "../config.json").to_s)
sheet = session.spreadsheet_by_key("1UrCw8kDssegW9iDTCeu3O99Ga0LiYN37uOn_izPPBQQ").worksheets[0]
tweets = (1..sheet.num_rows).map {|row| sheet[row, 1] }
File.write("#{file}.json", Oj.dump(tweets))
