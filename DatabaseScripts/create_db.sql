CREATE TABLE "Announcements" (
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
 	[Title] NVARCHAR(MAX) NOT NULL,
	[AnnouncementType] VARCHAR(MAX) NOT NULL,
	[Grades] VARCHAR(MAX) NOT NULL,
	[Announcement] VARCHAR(MAX) NOT NULL,
	[Author] NVARCHAR(MAX) NOT NULL,
	[DateCreated] DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
	[Approved] VARCHAR(5) NULL,
	[Pinned] VARCHAR(5) NULL,
	[PinnedDate] DATETIME NULL
)

CREATE TABLE "Roles" (
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
	[Role] VARCHAR(100) NOT NULL,
	[Inherits] VARCHAR(100) NULL,
	[Announcement:Admin] BIT NOT NULL,
	[Announcement:View] BIT NOT NULL,
	[Announcement:Create] BIT NOT NULL,
	[Announcement:Update] BIT NOT NULL,
	[Announcement:Delete] BIT NOT NULL,
)

CREATE TABLE "User" (
	[Username] VARCHAR(MAX) NOT NULL PRIMARY KEY,
	[FirstName] VARCHAR(100) NULL,
	[LastName] VARCHAR(100) NULL,
	[Role] VARCHAR(100)
)