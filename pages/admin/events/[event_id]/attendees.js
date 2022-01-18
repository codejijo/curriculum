import AdminEventSidebar from "../../../../component/admin/AdminEventSidebar";
const attendees = [
  {
    name: "Liam Olivia Anna",
    image: "/images/pic1.png"
  },
  {
    name: "Noah Emma",
    image: "/images/pic2.png"
  },
  {
    name: "Oliver Ava",
    image: "/images/pic1.png"
  },
  {
    name: "William Sophia",
    image: ""
  },
  {
    name: "James Charlotte",
    image: "/images/pic1.png"
  },
  {
    name: "Benjamin Amel",
    image: ""
  },
  {
    name: "William Sophi",
    image: "/images/pic2.png"
  },
  {
    name: "James Charlotte",
    image: ""
  },
  {
    name: "Benjamin Amelia",
    image: ""
  },
  {
    name: "Oliver Eva",
    image: "/images/pic1.png"
  }
];

import { getCookieValue } from "../../../../lib/cookie";
import notify from "../../../../lib/notify";
import EventService from "../../../../services/EventService";
import UserService from "../../../../services/UserService";

export async function getServerSideProps(context) {
  try {
    if (context.req.headers.cookie) {
      const contextCookie = getCookieValue(
        context.req.headers.cookie,
        "userNullcast"
      );
      if (contextCookie) {
        const cookie = JSON.parse(contextCookie);
        const username = cookie.user_name;
        const { data } = await UserService.getUserByUsername(username);
        const eventData = await EventService.getEventById(
          context.params.event_id
        );
        // removed roles from user data
        // const skillsRes = await SkillService.getSkills();
        if (data.roles[0] === "admin") {
          return {
            props: {
              profileData: {},
              eventData: eventData.data
            }
          };
        } else {
          return {
            props: {
              profileData: {}
            },
            redirect: {
              permanent: false,
              destination: "/"
            }
          };
        }
      } else {
        return {
          props: {
            profileData: {}
          },
          redirect: {
            permanent: false,
            destination: "/"
          }
        };
      }
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
      };
    }
  } catch (err) {
    notify(err?.response?.data?.message ?? err?.message, "error");
    return {
      props: {
        profileData: {}
      },
      redirect: {
        permanent: false,
        destination: "/"
      }
    };
  }
}

const EventAttendies = ({ eventData }) => {
  const shortName = (e) => {
    var matches = e.match(/\b(\w)/g);
    var acronym = matches.join("");
    return acronym.substring(0, 2);
  };
  return (
    <div>
      <AdminEventSidebar eventData={eventData} />
      <main className="ml-64">
        <div className="max-w-4xl mx-auto my-4">
          {attendees?.map((data) => (
            <div
              className="flex items-center py-2"
              key={data.name + data.image}
            >
              {data?.image ? (
                <div className="w-8 h-8 overflow-hidden rounded-full flex items-center justify-center text-white mr-3">
                  <img
                    src={data?.image}
                    alt="img"
                    className="w-full h-full"
                  ></img>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                  {shortName(data?.name)}
                </div>
              )}
              <span className="text-sm font-semibold">{data?.name}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EventAttendies;
