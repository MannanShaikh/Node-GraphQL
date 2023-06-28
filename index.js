var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var {
  buildSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
} = require('graphql');

const Department = [
  { d_Id: 1, d_name: "MEng" },
  { d_Id: 2, d_name: "MCS" },
  { d_Id: 3, d_name: "MAC" },
];
const Staff = [
  { s_Id: 101, d_Id: 1, s_name: "John" },
  { s_Id: 102, d_Id: 2, s_name: "Max" },
  { s_Id: 103, d_Id: 3, s_name: "Billy" },
  { s_Id: 104, d_Id: 1, s_name: "Alex" },
  { s_Id: 105, d_Id: 2, s_name: "Evan" },
  { s_Id: 106, d_Id: 3, s_name: "Henry" },
  { s_Id: 107, d_Id: 1, s_name: "Charles" },
];

// Define the Staff type
var staffType = new GraphQLObjectType({
  name: 'Staff',
  fields: {
    s_Id: { type: GraphQLInt },
    d_Id: { type: GraphQLInt },
    s_name: { type: GraphQLString },
  }
});

// Define the Department type
var departmentType = new GraphQLObjectType({
  name: "department",
  fields: {
    d_Id: { type: GraphQLInt },
    d_name: { type: GraphQLString }
  }
});

// Define the StaffDepartment type
var staff_departmentType = new GraphQLObjectType({
  name: "staff_department",
  fields: {
    s_Id: { type: GraphQLInt },
    d_Id: { type: GraphQLInt },
    s_name: { type: GraphQLString },
    d_name: { type: GraphQLString }
  }
});

// Define the Query type
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {

    // STAFF QUERIES

    Allstaff: {
      type: new GraphQLList(staffType),
      resolve: () => {
        return Staff;
      }
    },

    All_Staff_Department_Details: {
      type: new GraphQLList(staff_departmentType),
      resolve: () => {
        let ouput = Staff.map(e => {
          let temp = Department.find(element => element.d_Id === e.d_Id)
            e.d_name = temp.d_name;
          return e;
        })
        return ouput;
      }
    },

    StaffDetailsByDepartmentId: {
      type: new GraphQLList(staffType),
      args: {
        d_Id: { type: GraphQLInt }
      },
      resolve: (_, { d_Id }) => {
        return Staff.filter(item => item.d_Id == d_Id);
      }
    },

    StaffDetailsByDepartmentName: {
      type: new GraphQLList(staffType),
      args: {
        d_name: { type: GraphQLString }
      },
      resolve: (_, { d_name }) => {
        let depart = Department.find(i => i.d_name == d_name);
        return Staff.filter(item => item.d_Id == depart.d_Id);
      }
    },

    StaffDetailsByStaffId: {
      type: staffType,
      args: {
        s_Id: { type: GraphQLInt }
      },
      resolve: (_, { s_Id }) => {
        return Staff.find(item => item.s_Id == s_Id);
      }
    },

    StaffDetailsByStaffName: {
      type: new GraphQLList(staffType),
      args: {
        s_name: { type: GraphQLString }
      },
      resolve: (_, { s_name }) => {
        return Staff.find(item => item.s_name == s_name);
      }
    },

    // DEPARTMENT QUERIES
    
    Alldepartments: {
      type: new GraphQLList(departmentType),
      resolve: () => {
        return Department;
      }
    },

    DepartmentDetailsByDepartmentName: {
      type: departmentType,
      args: {
        d_name: { type: GraphQLString }
      },
      resolve: (_, { d_name }) => {
        return Department.find(item => item.d_name == d_name);
      }
    },

    DepartmentDetailsByDepartmentId: {
      type: departmentType,
      args: {
        d_Id: { type: GraphQLInt }
      },
      resolve: (_, { d_Id }) => {
        return Department.find(item => item.d_Id == d_Id);
      }
    },

  }
});

var MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    StaffInput: {
      type: GraphQLString,
      args: {
        s_name: { type: GraphQLString },
        d_name: { type: GraphQLString }
      },
      resolve: (_, { d_name, s_name }) => {
        return null;
      }
    },

    DepartmentInput: {
      type: GraphQLString,
      args: {
        d_Id: { type: GraphQLInt },
        d_name: { type: GraphQLString }
      },
      resolve: (_, { d_Id, d_name }) => {
        return null;
      }
    },
  }
});

var schema = new GraphQLSchema({ query: queryType, mutation: MutationType });

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(5000);